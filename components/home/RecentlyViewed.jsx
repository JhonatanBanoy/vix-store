"use client";

import { useEffect, useState } from "react";
import { History, Trash2 } from "lucide-react";

import Container from "../layout/Container";
import ProductGrid from "../product/ProductGrid";

const STORAGE_KEY = "vix:recently-viewed";

export default function RecentlyViewed({ products = [] }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const ids = Array.isArray(raw) ? raw : [];
      const byId = new Map(products.map((product) => [String(product.id), product]));

      setItems(
        ids
          .map((id) => byId.get(String(id)))
          .filter(Boolean)
          .slice(0, 4)
      );
    } catch {
      setItems([]);
    } finally {
      setReady(true);
    }
  }, [products]);

  if (!ready || items.length < 2) return null;

  const clear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Sin acceso a localStorage: no hay nada que limpiar.
    }
    setItems([]);
  };

  return (
    <section className="pt-12">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              <History className="h-6 w-6 text-brand" />
              Vistos recientemente
            </h2>
            <p className="mt-1 text-sm text-muted">Retoma donde lo dejaste.</p>
          </div>

          <button
            type="button"
            onClick={clear}
            className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            <Trash2 className="h-3.5 w-3.5" /> Limpiar
          </button>
        </div>

        <div className="mt-6">
          <ProductGrid products={items} />
        </div>
      </Container>
    </section>
  );
}
