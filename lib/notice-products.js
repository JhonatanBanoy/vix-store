import { unstable_cache } from "next/cache";

import { API_URL } from "./api";
import { normalizeProduct } from "./products";

/**
 * Productos que se anuncian en el aviso de esquina.
 * Se cachean 1 minuto para no consultar la API en cada página.
 */
export const getNoticeProducts = unstable_cache(
  async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        cache: "no-store",
      });
      if (!response.ok) return [];

      const data = await response.json();

      return (Array.isArray(data) ? data : [])
        .map(normalizeProduct)
        .filter((product) => product.isActive && product.id && product.name)
        .sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
        .slice(0, 2)
        .map(({ id, name }) => ({ id, name }));
    } catch {
      return [];
    }
  },
  ["vix-notice-products-v2"],
  { revalidate: 60 }
);
