import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const backendURL = import.meta.env.VITE_BACKEND_URL!;


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

export function formatEmailTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,

  })
}

