"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus } from "lucide-react"
import { createNewUser } from "./action"
import { showSuccess, showError } from "@/lib/toast-utils"
import {
  type FormData,
  PageHeader,
  UserBasicFields,
  PasswordField,
  RoleSelector,
  StudentFields,
  FormActions,
} from "./new-user-form-sections"

const DEFAULT_FORM: FormData = {
  email: "",
  password: "",
  fullName: "",
  role: "student",
  studentType: "servicio_social",
  requiredHours: 360,
}

export default function NewUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM)

  const onChange = (patch: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...patch }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createNewUser(formData)
      if (result.error) throw new Error(result.error)

      showSuccess("Usuario creado exitosamente. Redirigiendo...")
      setFormData(DEFAULT_FORM)
      setTimeout(() => router.push("/supervisor/students"), 2000)
    } catch (err: any) {
      showError(err.message || "Error al crear usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <PageHeader />

        <Card className="max-w-3xl mx-auto border-0 shadow-xl overflow-hidden dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="p-6 sm:p-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-b border-indigo-100 dark:border-indigo-900">
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <UserPlus className="h-5 w-5" />
              </div>
              <span className="text-xl sm:text-2xl text-gray-800 dark:text-white">Información del Usuario</span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-2 dark:text-gray-400">
              Completa todos los campos para crear una nueva cuenta
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <UserBasicFields formData={formData} onChange={onChange} loading={loading} />
              <PasswordField formData={formData} onChange={onChange} loading={loading} />
              <RoleSelector formData={formData} onChange={onChange} loading={loading} />
              {formData.role === "student" && (
                <StudentFields formData={formData} onChange={onChange} loading={loading} />
              )}
              <FormActions loading={loading} />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}