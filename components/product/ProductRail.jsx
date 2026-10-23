"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "../../lib/utils";
import ProductCard from "./ProductCard";

/**
 * Riel horizontal de productos.
 * - Muestra 4 tarjetas en escritorio y deja asomar la siguiente en móvil.
 * - Sin librerías: scroll nativo con snap y flechas.
 */
export default function ProductRail({
  products = [],
  title,
  description,
  eyebrow,
  href = "/products",
  linkLabel = "Ver todos",
}) {
  const headingId = useId();
  const scrollerRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(max <= 4 || el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    update();

    const el = scrollerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => observer.disconnect();
  }, [update, products.length]);

  const scrollByCard = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;

    const items = el.querySelectorAll("[data-rail-item]");
    let step = el.clientWidth * 0.8;

    if (items.length > 1) {
      step = items[1].offsetLeft - items[0].offsetLeft;
    }

    el.scrollBy({
      left: direction * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  if (!products.length) return null;

  return (
    <section aria-labelledby={headingId}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
              {eyebrow}
            </p>
          )}

          <h2
            id={headingId}
            className={cn("text-2xl font-bold sm:text-3xl", eyebrow && "mt-1")}
          >
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-muted">{description}</p>
          )}
        </div>

        <Link
          href={href}
          className="flex shrink-0 items-center gap-1 pb-1 text-sm font-semibold text-brand hover:underline"
        >
          {linkLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative mt-6">
        <div
          ref={scrollerRef}
          onScroll={update}
          role="region"
          aria-label={title ? `Productos: ${title}` : "Productos"}
          tabIndex={0}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pt-1 pb-2 [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div
              key={product.id}
              data-rail-item
              className="w-[78vw] max-w-[320px] shrink-0 snap-start sm:w-[46%] sm:max-w-none lg:w-[calc((100%_-_3rem)/4)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-paper to-transparent transition-opacity duration-300",
            atStart ? "opacity-0" : "opacity-100"
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-paper to-transparent transition-opacity duration-300",
            atEnd ? "opacity-0" : "opacity-100"
          )}
        />

        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={atStart}
          aria-label="Ver productos anteriores"
          className={cn(
            "absolute -left-3 top-[36%] z-[2] hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-paper/95 text-ink shadow-lg shadow-ink/10 backdrop-blur transition-all duration-200 hover:scale-105 hover:bg-ink hover:text-white lg:grid",
            atStart && "pointer-events-none opacity-0"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={atEnd}
          aria-label="Ver productos siguientes"
          className={cn(
            "absolute -right-3 top-[36%] z-[2] hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-paper/95 text-ink shadow-lg shadow-ink/10 backdrop-blur transition-all duration-200 hover:scale-105 hover:bg-ink hover:text-white lg:grid",
            atEnd && "pointer-events-none opacity-0"
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
