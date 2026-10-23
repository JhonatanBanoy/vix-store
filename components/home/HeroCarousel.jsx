"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Truck,
} from "lucide-react";

import ProductImage from "../ui/ProductImage";
import { cn, formatPrice } from "../../lib/utils";

const AUTOPLAY_MS = 3500;

export default function HeroCarousel({ products = [] }) {
  const slides = useMemo(() => {
    const withImage = products.filter((p) => p.image).slice(0, 2);
    const list = [{ type: "brand", key: "brand" }];

    for (const product of withImage) {
      list.push({ type: "product", key: product.id, product });
    }

    if (list.length < 3) list.push({ type: "promo", key: "promo" });

    return list;
  }, [products]);

  const [active, setActive] = useState(0);
  const touchStartX = useRef(null);

  // Avanza automáticamente cada 3,5 s, sin pausas por hover.
  useEffect(() => {
    if (slides.length < 2) return;

    const timer = setTimeout(() => {
      setActive((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => clearTimeout(timer);
  }, [active, slides.length]);

  const goTo = (index) => {
    setActive((index + slides.length) % slides.length);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 40) return;
    goTo(active + (delta < 0 ? 1 : -1));
  };

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label="Colección destacada"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink shadow-2xl shadow-brand/20"
      >
        {slides.map((slide, index) => (
          <div
            key={slide.key}
            aria-hidden={index !== active}
            inert={index !== active}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-out",
              index === active
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-105 opacity-0"
            )}
          >
            {slide.type === "brand" && <BrandSlide />}
            {slide.type === "product" && (
              <ProductSlide product={slide.product} />
            )}
            {slide.type === "promo" && <PromoSlide />}
          </div>
        ))}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Slide anterior"
              className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/30 text-white opacity-0 backdrop-blur transition-opacity hover:bg-ink/50 focus-visible:opacity-100 group-hover:opacity-100 sm:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Slide siguiente"
              className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/30 text-white opacity-0 backdrop-blur transition-opacity hover:bg-ink/50 focus-visible:opacity-100 group-hover:opacity-100 sm:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Indicadores */}
      {slides.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ir al slide ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === active
                  ? "w-6 bg-brand"
                  : "w-2 bg-line hover:bg-muted/50"
              )}
            />
          ))}
        </div>
      )}

      {/* Sello flotante */}
      <div className="absolute -left-3 top-10 z-10 rounded-xl border border-line bg-paper px-4 py-3 shadow-lg sm:-left-6">
        <p className="text-[11px] uppercase tracking-wide text-muted">Envío</p>
        <p className="text-sm font-semibold text-success">Gratis</p>
      </div>
    </div>
  );
}

function BrandSlide() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-brand via-brand to-ink px-6 text-center">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <span className="relative font-display text-6xl font-bold tracking-tight text-white sm:text-7xl">
        V<span className="text-deal">I</span>X
      </span>
      <span className="relative text-[11px] uppercase tracking-[0.35em] text-white/70">
        Nueva colección
      </span>

      <Link
        href="/products"
        className="relative mt-2 inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-white/90"
      >
        Ver productos <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function ProductSlide({ product }) {
  return (
    <Link href={`/products/${product.id}`} className="absolute inset-0 block">
      <ProductImage
        src={product.image}
        alt={product.name}
        sizes="(max-width: 1024px) 90vw, 420px"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur">
          Destacado
        </span>

        <p className="mt-3 font-display text-2xl font-bold leading-tight">
          {product.name}
        </p>
        <p className="mt-1 text-lg font-semibold text-white/90">
          {formatPrice(product.price)}
        </p>

        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
          Ver producto <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function PromoSlide() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink via-ink to-brand px-8 text-center text-white">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
        <Truck className="h-6 w-6" />
      </span>

      <p className="font-display text-2xl font-bold">Envío gratis</p>
      <p className="text-sm text-white/70">En compras a todo el país</p>

      <Link
        href="/products"
        className="mt-2 inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-white/90"
      >
        Explorar <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
