import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatPrice(price: number): string {
  return `₹${price}`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getSpiceLabel(level: number): string {
  const labels = ["Mild", "Medium", "Spicy", "Hot", "Extra Hot", "Fire 🔥"];
  return labels[level] || "Unknown";
}

export function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "abhi";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min pehle`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ghante pehle`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} din pehle`;
  return date.toLocaleDateString("hi-IN");
}

export function getVerificationBadge(level: string): { label: string; color: string } {
  switch (level) {
    case "gps": return { label: "📍 GPS Verified", color: "text-chutney" };
    case "receipt": return { label: "🧾 Receipt Proof", color: "text-primary" };
    case "photo": return { label: "📸 Photo Proof", color: "text-gold" };
    default: return { label: "✓ Basic Review", color: "text-muted-foreground" };
  }
}

export function isOpenNow(openingTime?: string, closingTime?: string): boolean {
  if (!openingTime || !closingTime) return false;
  const now = new Date();
  const [openH, openM] = openingTime.split(":").map(Number);
  const [closeH, closeM] = closingTime.split(":").map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  }
  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

export const CATEGORIES = [
  { id: "chaat", name: "Chaat", nameHi: "चाट", icon: "🥘" },
  { id: "biryani", name: "Biryani", nameHi: "बिरयानी", icon: "🍚" },
  { id: "kebab", name: "Kebab", nameHi: "कबाब", icon: "🍢" },
  { id: "tikki", name: "Tikki", nameHi: "टिक्की", icon: "🥔" },
  { id: "sweets", name: "Sweets", nameHi: "मिठाई", icon: "🍮" },
  { id: "chai", name: "Chai", nameHi: "चाय", icon: "☕" },
  { id: "paratha", name: "Paratha", nameHi: "पराठा", icon: "🫓" },
  { id: "thali", name: "Thali", nameHi: "थाली", icon: "🍱" },
  { id: "lassi", name: "Lassi", nameHi: "लस्सी", icon: "🥛" },
  { id: "rolls", name: "Rolls", nameHi: "रोल", icon: "🌯" },
];

export const AREAS = [
  "Chowk", "Aminabad", "Hazratganj", "Gomti Nagar", "Aliganj",
  "Charbagh", "Nakhas", "Victoriaganj", "Kaiserbagh", "Latouche Road",
];
