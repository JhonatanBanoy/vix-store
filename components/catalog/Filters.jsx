"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

export default function Filters({ onDone }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const apply = (mutate) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    onDone?.();
  };

  const toggleFlag = (key) =>
    apply((p) => {
      if (p.get(key) === "1") p.delete(key);
      else p.set(key, "1");
    });

  const clearAll = () => {
    router.push("/products", { scroll: false });
    onDone?.();
  };

  const hasFilters =
    searchParams.has("min") ||
    searchParams.has("max") ||
    searchParams.get("available") === "1" ||
    searchParams.get("offers") === "1";

  return (
    <div className="space-y-7">
      {/* Disponibilidad */}
      <section>
        <h3 className="text-sm font-semibold">Disponibilidad</h3>
        <div className="mt-3 space-y-2">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
            <input
              type="checkbox"
              checked={searchParams.get("available") === "1"}
              onChange={() => toggleFlag("available")}
              className="h-4 w-4 rounded border-line accent-[#5B3DF5]"
            />
            Solo disponibles
          </label>
        </div>
      </section>

      {/* Ofertas */}
      <section>
        <h3 className="text-sm font-semibold">Promociones</h3>
        <div className="mt-3 space-y-2">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
            <input
              type="checkbox"
              checked={searchParams.get("offers") === "1"}
              onChange={() => toggleFlag("offers")}
              className="h-4 w-4 rounded border-line accent-[#5B3DF5]"
            />
            Solo ofertas
          </label>
        </div>
      </section>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          <X className="h-3.5 w-3.5" /> Limpiar filtros
        </button>
      )}
    </div>
  );
}
