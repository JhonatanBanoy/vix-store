import { API_URL } from "./api";

/**
 * Convierte un producto de la API a la forma que usa la tienda.
 * La API puede devolver _id o id; aquí lo unificamos.
 */
export function normalizeProduct(p = {}) {
  const images =
    Array.isArray(p.images) && p.images.length
      ? p.images
      : p.image
        ? [p.image]
        : [];

  return {
    id: p._id || p.id || "",
    name: p.name || p.title || "Producto",
    description: p.description || "",
    shortDescription: p.shortDescription || "",
    price: Number(p.price) || 0,
    compareAtPrice:
      p.compareAtPrice !== undefined && p.compareAtPrice !== null
        ? Number(p.compareAtPrice)
        : null,
    image: images[0] || null,
    images,
    stock: Number(p.stock) || 0,
    isActive: p.isActive !== false,
    status: p.status || "active",
    category: p.category || null,
    createdAt: p.createdAt || null,
  };
}

/** Trae todos los productos. Si el backend falla, devuelve [] sin romper la página. */
export async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/api/products`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data.map(normalizeProduct) : [];
  } catch (error) {
    console.error("fetchProducts:", error.message);
    return [];
  }
}

/** Trae un producto por ID. Devuelve null si no existe o el ID es inválido. */
export async function fetchProductById(id) {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return normalizeProduct(await res.json());
  } catch (error) {
    console.error("fetchProductById:", error.message);
    return null;
  }
}
