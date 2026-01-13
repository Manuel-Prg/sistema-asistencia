'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History, ArrowLeft, Plus, Minus, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

interface AdjustmentRecord {
  id: string
  created_at: string
  hours_worked: number | null
  early_departure_reason: string | null
  student: {
    profile: {
      full_name: string
    }
  }
}

export default function AdjustmentsHistoryPage() {
  const [adjustments, setAdjustments] = useState<AdjustmentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')

  const supabase = getSupabaseBrowserClient()

  // Función para cargar ajustes
  const fetchAdjustments = async (showLoading = false) => {
    try {
      setError(null)
      if (showLoading) {
        console.log('🔄 Manual refresh triggered')
        setIsRefreshing(true)
      }

      const { data, error: fetchError } = await supabase
        .from('attendance_records')
        .select('*, student:students!inner(*, profile:profiles!inner(*))')
        .eq('room', 'Ajuste Manual')
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('❌ Error fetching adjustments:', fetchError)
        setError(`Error: ${fetchError.message}`)
        return
      }

      console.log(`✅ Loaded ${data?.length || 0} adjustments`)
      setAdjustments(data || [])
      setLastUpdate(new Date())
    } catch (error: any) {
      console.error('❌ Exception:', error)
      setError(`Exception: ${error.message}`)
    } finally {
      if (showLoading) setIsRefreshing(false)
      setIsLoading(false)
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    console.log('🚀 Component mounted, loading initial data...')
    fetchAdjustments()
  }, [])

  // Suscripción en tiempo real (la única actualización automática)
  useEffect(() => {
    console.log('📡 Setting up real-time subscription...')
    setConnectionStatus('connecting')

    const channel = supabase
      .channel('attendance_adjustments_realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'attendance_records',
          filter: 'room=eq.Ajuste Manual',
        },
        (payload: { eventType: any; new: { id: any } }) => {
          console.log('🔔 Real-time update received:', payload.eventType, payload.new?.id)
          // Recargar datos cuando hay cambios
          fetchAdjustments()
        }
      )
      .subscribe((status: string) => {
        console.log('📡 Subscription status:', status)
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected')
          console.log('✅ Real-time connection established')
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setConnectionStatus('disconnected')
          console.warn('⚠️ Real-time connection lost')
        }
      })

    return () => {
      console.log('📡 Cleaning up real-time subscription...')
      channel.unsubscribe()
    }
  }, [])

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatLastUpdate = () => {
    return lastUpdate.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <History className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
              Historial de Ajustes
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Registro de todos los ajustes manuales realizados
          </p>
        </div>

        {/* Botones - Responsive */}
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAdjustments(true)}
            disabled={isRefreshing}
            className="gap-2 flex-1 sm:flex-initial"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline">{isRefreshing ? 'Actualizando...' : 'Actualizar'}</span>
            <span className="xs:hidden">{isRefreshing ? '...' : ''}</span>
          </Button>
          <Link href="/supervisor/manage-hours" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="sm" className="gap-2 w-full">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden xs:inline">Volver</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Indicador de estado de conexión - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
        <div className="text-gray-500 dark:text-gray-400 order-2 sm:order-1">
          <span className="hidden sm:inline">Última actualización: </span>
          <span className="sm:hidden">Actualizado: </span>
          <span className="font-mono">{formatLastUpdate()}</span>
        </div>

        <div className="flex items-center gap-2 order-1 sm:order-2">
          {connectionStatus === 'connected' && (
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-medium text-xs sm:text-sm">
                <span className="hidden sm:inline">Actualizaciones en tiempo real</span>
                <span className="sm:hidden">Tiempo real</span>
              </span>
            </div>
          )}
          {connectionStatus === 'connecting' && (
            <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400">
              <RefreshCw className="h-3 w-3 animate-spin flex-shrink-0" />
              <span className="text-xs sm:text-sm">Conectando...</span>
            </div>
          )}
          {connectionStatus === 'disconnected' && (
            <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Desconectado</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert - Responsive */}
      {error && (
        <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-2 sm:gap-3">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-red-900 dark:text-red-200 break-words">{error}</p>
            <p className="text-xs text-red-800 dark:text-red-300 mt-1">
              Intenta actualizar manualmente con el botón de arriba
            </p>
          </div>
        </div>
      )}

      {/* Card Principal - Responsive */}
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">
            Ajustes Realizados ({adjustments?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">
                Cargando ajustes...
              </p>
            </div>
          ) : !adjustments || adjustments.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">
                No hay ajustes registrados
              </p>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">
                Los ajustes manuales aparecerán aquí automáticamente
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {adjustments.map((adjustment) => {
                const isSuma = adjustment.early_departure_reason?.startsWith('SUMA')
                const isResta = adjustment.early_departure_reason?.startsWith('RESTA')

                let reason = adjustment.early_departure_reason || ''
                if (isSuma) {
                  reason = reason.replace('SUMA: ', '')
                } else if (isResta) {
                  reason = reason.replace('RESTA: ', '')
                } else {
                  reason = reason.replace('AJUSTE MANUAL: ', '')
                }

                return (
                  <div
                    key={adjustment.id}
                    className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Nombre y Badge - Responsive */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate max-w-full sm:max-w-none">
                            {adjustment.student.profile.full_name}
                          </h3>
                          {isSuma && (
                            <Badge
                              variant="secondary"
                              className="gap-1 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-800 text-xs sm:text-sm flex-shrink-0"
                            >
                              <Plus className="h-3 w-3" />
                              {adjustment.hours_worked?.toFixed(1)}h
                            </Badge>
                          )}
                          {isResta && (
                            <Badge
                              variant="secondary"
                              className="gap-1 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800 text-xs sm:text-sm flex-shrink-0"
                            >
                              <Minus className="h-3 w-3" />
                              {adjustment.hours_worked?.toFixed(1)}h
                            </Badge>
                          )}
                          {!isSuma && !isResta && (
                            <Badge variant="secondary" className="dark:bg-gray-700 text-xs sm:text-sm flex-shrink-0">
                              {adjustment.hours_worked?.toFixed(1)}h
                            </Badge>
                          )}
                        </div>

                        {/* Razón - Responsive */}
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 break-words">
                          {reason}
                        </p>

                        {/* Fecha - Responsive */}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="hidden sm:inline">Registrado el </span>
                          {formatDateTime(adjustment.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}