"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "../../context/CartContext";
import { cn, formatPrice, discountPercent } from "../../lib/utils";
import { categoryLabel } from "../../lib/categories";
import Badge from "../ui/Badge";
import ProductImage from "../ui/ProductImage";

export default function ProductCard({ product, className, compact = false }) {
  const { addToCart } = useCart();

  const outOfStock = product.stock <= 0;
  const discount = discountPercent(product.compareAtPrice, product.price);
  const category = categoryLabel(product.category);
  const href = `/products/${product.id}`;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-line bg-paper transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/10 hover:shadow-xl",
        className
      )}
    >
      <Link
        href={href}
        className={cn(
          "relative block overflow-hidden bg-bone",
          compact ? "aspect-[5/4]" : "aspect-square"
        )}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
          {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
          {outOfStock && <Badge variant="danger">Agotado</Badge>}
        </div>

        {category && (
          <span className="absolute right-3 top-3 max-w-[60%] truncate rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-ink shadow-sm backdrop-blur">
            {category}
          </span>
        )}

        {!outOfStock && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="absolute inset-x-3 bottom-3 flex h-10 items-center justify-center gap-2 rounded-xl bg-ink text-sm font-medium text-white transition-all duration-200 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
          >
            <ShoppingBag className="h-4 w-4" />
            Añadir
          </button>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link
          href={href}
          className="line-clamp-2 text-sm font-medium leading-snug transition-colors hover:text-brand"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-2">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          {product.compareAtPrice > product.price && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <p className="text-xs font-medium text-success">Envío a todo el país</p>
      </div>
    </div>
  );
}
