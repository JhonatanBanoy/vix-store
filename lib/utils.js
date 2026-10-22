import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Une clases de Tailwind resolviendo conflictos.
 * Ej: cn("px-2", "px-4") -> "px-4"
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un precio en pesos colombianos.
 * formatPrice(129900) -> "$ 129.900"
 */
export function formatPrice(value, currency = "COP") {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calcula el porcentaje de descuento entre precio anterior y actual.
 * discountPercent(100000, 70000) -> 30
 */
export function discountPercent(compareAtPrice, price) {
  const before = Number(compareAtPrice);
  const now = Number(price);
  if (!before || before <= now) return 0;
  return Math.round(((before - now) / before) * 100);
}
