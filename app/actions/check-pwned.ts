"use server"

import crypto from "crypto"

/**
 * Checks if a password has been compromised using the HaveIBeenPwned API (k-Anonymity).
 * Returns true if compromised, false otherwise.
 * Fails open (returns false) if API is unreachable or times out.
 */
export async function isPasswordCompromised(password: string): Promise<boolean> {
    try {
        // 1. Hash SHA-1 of the password (Must be UpperCase for API)
        const hash = crypto.createHash("sha1").update(password).digest("hex").toUpperCase()

        // 2. The first 5 characters of the hash (prefix)
        const prefix = hash.slice(0, 5)
        const suffix = hash.slice(5)

        // 3. Query HaveIBeenPwned API with Timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

        try {
            const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
                headers: {
                    "Add-Padding": "true",
                },
                cache: "no-store",
                signal: controller.signal,
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                console.warn("HaveIBeenPwned API error:", response.status)
                return false // Fail-open
            }

            const text = await response.text()

            // 4. Search for the suffix in the results
            const hashes = text.split("\n")
            for (const line of hashes) {
                const [hashSuffix] = line.split(":")
                if (hashSuffix === suffix) {
                    return true // Password found in breach!
                }
            }

            return false // Password safe
        } catch (fetchError: any) {
            clearTimeout(timeoutId)
            if (fetchError.name === 'AbortError') {
                console.warn("HaveIBeenPwned API timed out (fail-open)")
            } else {
                console.warn("HaveIBeenPwned API fetch error:", fetchError)
            }
            return false // Fail-open
        }

    } catch (error) {
        console.error("Error checking password compromise:", error)
        return false // Fail-open
    }
}
