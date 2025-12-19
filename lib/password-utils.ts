export const COMMON_PASSWORDS = [
    "123456", "password", "12345678", "qwerty", "123456789", "12345", "1234", "111111", "1234567", "dragon",
    "123123", "baseball", "football", "654321", "monkey", "letmein", "princess", "sunshine", "mustang", "master",
    "michael", "charlie", "jordan", "superman", "jennifer", "batman", "password123", "alexander", "ashley", "andrew",
    "daniel", "bailey", "cameron", "hunter", "christian", "joshua", "brandon", "austin", "justin", "matthew",
    "system", "admin", "secret", "server", "router", "switch", "access", "manager", "support", "tester",
    "asdfgh", "zxcvbn", "poiuyt", "welcom", "welcome", "welcome1", "pass123", "test1234", "cambiame", "temporal",
    "maestro", "usuario", "prueba", "contraseña", "clave123", "hola123", "mexico", "america", "familia", "teamo"
];

export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
}

/**
 * Valida la seguridad de una contraseña localmente.
 * Revisa longitud y si está en una lista de contraseñas comunes.
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
    const errors: string[] = [];

    // 1. Longitud mínima
    if (password.length < 8) {
        errors.push("La contraseña debe tener al menos 8 caracteres.");
    }

    // 2. Verificación de contraseña común (case-insensitive)
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
        errors.push("Esta contraseña es demasiado común y fácil de adivinar.");
    }

    // 3. Complejidad básica (opcional pero recomendada)
    // Al menos un número o símbolo podría ser un requerimiento futuro, 
    // por ahora mantenemos simple como pidió el usuario pero robusto en longitud/comunes.

    return {
        isValid: errors.length === 0,
        errors
    };
}
