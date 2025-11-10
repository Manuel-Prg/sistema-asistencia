// lib/utils/date-formatter.ts
// Utilidad centralizada para formatear fechas correctamente

export function formatDateTime(dateString: string) {
  const date = new Date(dateString)
  
  return {
    date: date.toLocaleDateString('es-MX', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      timeZone: 'America/Mexico_City' // ✅ Zona horaria de Villahermosa, Tabasco
    }),
    time: date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true, // ✅ Formato 12 horas (AM/PM)
      timeZone: 'America/Mexico_City'
    })
  }
}

export function formatTime(dateString: string) {
  const date = new Date(dateString)
  
  return date.toLocaleTimeString('es-MX', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Mexico_City'
  })
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  
  return date.toLocaleDateString('es-MX', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    timeZone: 'America/Mexico_City'
  })
}