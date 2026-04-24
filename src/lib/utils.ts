import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format minor units (pesewas/kobo) as GHS/USD string. */
export function formatPrice(minor: number, currency = "GHS") {
  const major = minor / 100;
  const symbol = currency === "GHS" ? "GH₵" : currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${major.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Resin Studio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Handcrafted resin art, gift packaging, custom print T-shirts, mugs, and scented candles — made in Ghana. Plus online resin courses with video lessons and PDF guides.",
  keywords: [
    "resin art Ghana",
    "gift packaging Accra",
    "custom T-shirt printing Ghana",
    "scented candles",
    "resin classes online",
    "handmade gifts Ghana",
  ],
};
