import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// utils/parseEmails.ts
export function parseEmails(text: string): string[] {
  return text
    .split(/[\n,]/)               // split by newline or comma
    .map(e => e.trim())
    .filter(e => isValidEmail(e));
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
