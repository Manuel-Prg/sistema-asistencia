// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMexicoCityTime(dateInput: string | Date): Date {
  const date = new Date(dateInput)
  const mexicoString = date.toLocaleString("en-US", {
    timeZone: "America/Mexico_City",
  })
  return new Date(mexicoString)
}
