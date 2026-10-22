"use client";

import { useState } from "react";

import { cn } from "../../lib/utils";
import Badge from "../ui/Badge";
import ProductImage from "../ui/ProductImage";

export default function ProductGallery({ images = [], name, discount = 0 }) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-2xl border border-line bg-bone text-sm text-muted">
        Sin imagen
      </div>
    );
  }

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-bone">
        <ProductImage
          src={current}
          alt={name}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />

        {discount > 0 && (
          <Badge variant="sale" className="absolute left-4 top-4">
            -{discount}%
          </Badge>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-bone transition-all",
                i === active
                  ? "border-brand ring-2 ring-brand/20"
                  : "border-line hover:border-muted"
              )}
            >
              <ProductImage
                src={src}
                alt={`${name} — imagen ${i + 1}`}
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
