import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sichere toFixed-Funktion, die undefined/null-Werte abfängt
 */
export function safeToFixed(value: number | undefined | null, digits: number = 2): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0'
  }
  return value.toFixed(digits)
}

/**
 * Sichere Formatierung für Prozentsätze
 */
export function safePercentage(value: number | undefined | null, digits: number = 1): string {
  return `${safeToFixed(value, digits)}%`
}
