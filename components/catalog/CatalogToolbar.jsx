"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

import Filters from "./Filters";

export default function CatalogToolbar({ total = 0, buckets = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const sort = searchParams.get("sort") || "relevance";

  const handleSort = (e) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;
    if (value === "relevance") params.delete("sort");
    else params.set("sort", value);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">{total}</span>{" "}
          {total === 1 ? "resultado" : "resultados"}
        </p>

        <div className="flex items-center gap-2">
          {/* Botón filtros móvil */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-medium transition-colors hover:bg-bone lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filtros
          </button>

          {/* Orden */}
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden text-muted sm:inline">Ordenar por</span>
            <select
              value={sort}
              onChange={handleSort}
              className="h-9 rounded-lg border border-line bg-paper px-2 text-sm outline-none focus:border-brand"
            >
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name">Nombre A-Z</option>
              <option value="newest">Más recientes</option>
            </select>
          </label>
        </div>
      </div>

      {/* Drawer móvil */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-paper p-5 shadow-2xl lg:hidden">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Filtros</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar filtros"
                className="rounded-lg p-2 text-muted hover:bg-bone hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6">
              <Filters buckets={buckets} onDone={() => setOpen(false)} />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
