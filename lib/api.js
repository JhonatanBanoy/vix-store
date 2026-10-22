import axios from "axios";

/**
 * URL base del backend (Express).
 * Se configura en .env.local → NEXT_PUBLIC_API_URL
 */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

/**
 * Cliente axios con baseURL apuntando a /api del backend.
 * Uso: api.get("/products")  →  http://localhost:5000/api/products
 */
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

export default api;
