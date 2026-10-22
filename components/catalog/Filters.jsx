"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { cn, formatPrice } from "../../lib/utils";

export default function Filters({ buckets = [], onDone }) {
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

  const isPriceActive = (b) =>
    searchParams.get("min") === String(b.min) &&
    searchParams.get("max") === String(b.max);

  const togglePrice = (b) =>
    apply((p) => {
      if (isPriceActive(b)) {
        p.delete("min");
        p.delete("max");
      } else {
        p.set("min", String(b.min));
        p.set("max", String(b.max));
      }
    });

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
      {/* Precio */}
      <section>
        <h3 className="text-sm font-semibold">Precio</h3>
        <ul className="mt-3 space-y-2">
          {buckets.map((b) => (
            <li key={`${b.min}-${b.max}`}>
              <button
                type="button"
                onClick={() => togglePrice(b)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                  isPriceActive(b)
                    ? "bg-brand-soft font-medium text-brand"
                    : "text-muted hover:bg-bone hover:text-ink"
                )}
              >
                <span>
                  {formatPrice(b.min)} — {formatPrice(b.max)}
                </span>
                <span className="text-xs">{b.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

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
