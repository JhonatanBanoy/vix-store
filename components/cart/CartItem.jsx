"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, AlertCircle } from "lucide-react";

import { useCart } from "../../context/CartContext";
import { cn, formatPrice } from "../../lib/utils";

export default function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const stock = Number(item.stock);
  const outOfStock = Number.isFinite(stock) && stock <= 0;
  const max = Number.isFinite(stock) && stock > 0 ? stock : Infinity;
  const atMax = item.quantity >= max;

  return (
    <div className="flex gap-4 border-b border-line py-5 first:pt-0 last:border-b-0">
      {/* Imagen */}
      <Link
        href={`/products/${item.id}`}
        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-bone"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name || "Producto"}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full items-center justify-center px-1 text-center text-[10px] text-muted">
            Sin imagen
          </span>
        )}
      </Link>

      {/* Datos */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${item.id}`}
              className="font-medium leading-snug transition-colors hover:text-brand"
            >
              {item.name || "Producto"}
            </Link>

            <p className="mt-1 text-sm text-muted">
              {formatPrice(item.price)} c/u
            </p>

            {outOfStock && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-danger">
                <AlertCircle className="h-3.5 w-3.5" /> Sin stock
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            aria-label={`Quitar ${item.name || "producto"}`}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-danger/5 hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          {/* Cantidad */}
          <div className="inline-flex items-center rounded-lg border border-line">
            <button
              type="button"
              onClick={() => decreaseQuantity(item.id)}
              disabled={item.quantity <= 1}
              aria-label="Disminuir cantidad"
              className="flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-ink disabled:opacity-30"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>

            <span className="w-8 text-center text-sm font-semibold">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => increaseQuantity(item.id)}
              disabled={atMax || outOfStock}
              aria-label="Aumentar cantidad"
              className="flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-ink disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <span className="font-semibold">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>

        {Number.isFinite(stock) && stock > 0 && atMax && (
          <p className="mt-1 text-right text-xs text-muted">
            Máximo disponible: {stock}
          </p>
        )}
      </div>
    </div>
  );
}
