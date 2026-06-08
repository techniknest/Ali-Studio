import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskSecret(value: string): string {
  if (!value || value.length <= 7) return "••••••••";
  const start = value.slice(0, 4);
  const end = value.slice(-3);
  const middle = "•".repeat(Math.min(value.length - 7, 20));
  return `${start}${middle}${end}`;
}

export function formatWhatsAppUrl(number: string): string {
  const cleaned = number.replace(/\D/g, "");
  return `https://wa.me/${cleaned}`;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getDisplayCategory(category: string, title: string, imageUrl?: string): string {
  if (category && category.toLowerCase() !== "other") {
    return category;
  }

  const url = (imageUrl || "").toLowerCase();
  const lowerTitle = (title || "").toLowerCase();

  if (url.includes("groom") || url.includes("bridal") || lowerTitle.includes("bridal") || lowerTitle.includes("groom")) {
    return "Bridal Shoot";
  }
  if (url.includes("wedding") || lowerTitle.includes("wedding")) {
    return "Wedding Film";
  }
  if (url.includes("drone") || lowerTitle.includes("drone")) {
    return "Drone Coverage";
  }
  if (url.includes("fashion") || lowerTitle.includes("fashion")) {
    return "Fashion Shoot";
  }
  if (url.includes("podcast") || lowerTitle.includes("podcast")) {
    return "Podcast Production";
  }
  if (url.includes("commercial") || lowerTitle.includes("commercial")) {
    return "Commercial Ad";
  }
  if (url.includes("album") || lowerTitle.includes("album")) {
    return "Album Design";
  }

  // Use a hash of the title + image to select a realistic category deterministically
  const categories = [
    "Wedding Film",
    "Bridal Shoot",
    "Couples Portrait",
    "Pre-Wedding Shoot",
    "Event Coverage",
    "Fashion Portrait",
    "Cinematic Highlights"
  ];

  let hash = 0;
  const str = title + (imageUrl || "");
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % categories.length;
  return categories[index];
}
