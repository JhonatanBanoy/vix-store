import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * Construye la URL conservando los filtros actuales.
 */
function buildHref(searchParams, page) {
  const params = new URLSearchParams();

  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (!value || key === "page") return;
    params.set(key, String(value));
  });

  if (page > 1) params.set("page", String(page));

  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export default function Pagination({ page = 1, totalPages = 1, searchParams = {} }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    if (
      totalPages <= 7 ||
      i === 1 ||
      i === totalPages ||
      Math.abs(i - page) <= 1
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <nav
      aria-label="Paginación"
      className="mt-10 flex items-center justify-center gap-1.5"
    >
      <Link
        href={buildHref(searchParams, Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-line text-sm transition-colors",
          page === 1
            ? "pointer-events-none opacity-40"
            : "hover:bg-bone"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`dots-${i}`} className="px-2 text-muted">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(searchParams, p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
              p === page
                ? "border-brand bg-brand text-white"
                : "border-line hover:bg-bone"
            )}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={buildHref(searchParams, Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-line text-sm transition-colors",
          page === totalPages
            ? "pointer-events-none opacity-40"
            : "hover:bg-bone"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
