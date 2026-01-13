// lib/toast-utils.ts
import { toast } from "sonner"
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react"

/**
 * Utilidades para mostrar notificaciones con diseño mejorado
 */

export const showSuccess = (message: string) => {
    toast.success(message, {
        duration: 4000,
        icon: "✓",
        className: "toast-success",
    })
}

export const showError = (message: string) => {
    toast.error(message, {
        duration: 5000,
        icon: "✕",
        className: "toast-error",
    })
}

export const showWarning = (message: string) => {
    toast.warning(message, {
        duration: 4500,
        icon: "⚠",
        className: "toast-warning",
    })
}

export const showInfo = (message: string) => {
    toast.info(message, {
        duration: 4000,
        icon: "ℹ",
        className: "toast-info",
    })
}

/**
 * Mapeo de errores de Supabase a mensajes en español
 */
export const getSpanishErrorMessage = (error: any): string => {
    const errorMessage = error?.message || error?.toString() || ""

    // Errores de autenticación
    if (errorMessage.includes("Invalid login credentials")) {
        return "Credenciales de inicio de sesión inválidas"
    }
    if (errorMessage.includes("Email not confirmed")) {
        return "Por favor confirma tu correo electrónico"
    }
    if (errorMessage.includes("Invalid email")) {
        return "Correo electrónico inválido"
    }
    if (errorMessage.includes("Password should be at least")) {
        return "La contraseña debe tener al menos 6 caracteres"
    }
    if (errorMessage.includes("User already registered")) {
        return "Este usuario ya está registrado"
    }
    if (errorMessage.includes("Email rate limit exceeded")) {
        return "Demasiados intentos. Por favor espera un momento"
    }

    // Errores de sesión
    if (errorMessage.includes("No hay sesión activa") || errorMessage.includes("not authenticated")) {
        return "No hay sesión activa. Por favor inicia sesión"
    }
    if (errorMessage.includes("Session expired")) {
        return "Tu sesión ha expirado. Por favor inicia sesión nuevamente"
    }

    // Errores de red
    if (errorMessage.includes("Network") || errorMessage.includes("fetch")) {
        return "Error de conexión. Verifica tu internet"
    }
    if (errorMessage.includes("timeout")) {
        return "La solicitud tardó demasiado. Intenta nuevamente"
    }

    // Errores de base de datos
    if (errorMessage.includes("duplicate key")) {
        return "Este registro ya existe"
    }
    if (errorMessage.includes("foreign key")) {
        return "No se puede eliminar este registro porque está en uso"
    }
    if (errorMessage.includes("not found")) {
        return "No se encontró el registro solicitado"
    }

    // Errores de permisos
    if (errorMessage.includes("permission") || errorMessage.includes("unauthorized")) {
        return "No tienes permisos para realizar esta acción"
    }

    // Error genérico
    return errorMessage || "Ha ocurrido un error inesperado"
}

/**
 * Muestra un error traducido automáticamente
 */
export const showErrorTranslated = (error: any) => {
    const message = getSpanishErrorMessage(error)
    showError(message)
}
