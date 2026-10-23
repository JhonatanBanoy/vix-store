"use client";

import { useEffect } from "react";

const STORAGE_KEY = "vix:recently-viewed";
const MAX_ITEMS = 8;

export default function TrackRecentlyViewed({ productId }) {
  useEffect(() => {
    if (!productId) return;

    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const ids = Array.isArray(raw)
        ? raw.filter((id) => typeof id === "string")
        : [];

      const next = [
        String(productId),
        ...ids.filter((id) => id !== String(productId)),
      ].slice(0, MAX_ITEMS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Si el navegador bloquea localStorage, simplemente no guardamos nada.
    }
  }, [productId]);

  return null;
}
