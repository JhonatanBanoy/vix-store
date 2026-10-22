"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap, Minus, Plus } from "lucide-react";

import { useCart } from "../../context/CartContext";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { formatPrice, discountPercent } from "../../lib/utils";

export default function ProductBuyBox({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);

  const outOfStock = product.stock <= 0;
  const max = Math.max(1, product.stock);
  const discount = discountPercent(product.compareAtPrice, product.price);

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => Math.min(max, q + 1));

  const handleAdd = (goToCart) => {
    if (outOfStock) return;
    addToCart(product, quantity);
    if (goToCart) router.push("/cart");
  };

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      {/* Precio */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
        {product.compareAtPrice > product.price && (
          <>
            <span className="text-lg text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
            {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
          </>
        )}
      </div>

      {/* Disponibilidad */}
      <p className="mt-2 text-sm">
        {outOfStock ? (
          <span className="font-semibold text-danger">Sin stock</span>
        ) : (
          <span className="font-semibold text-success">
            Disponible · {product.stock} unidades
          </span>
        )}
      </p>

      {/* Cantidad */}
      <div className="mt-5">
        <label className="text-sm font-medium">Cantidad</label>
        <div className="mt-2 flex items-center gap-4">
          <div className="inline-flex items-center rounded-xl border border-line">
            <button
              type="button"
              onClick={decrease}
              disabled={outOfStock || quantity <= 1}
              aria-label="Disminuir cantidad"
              className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-ink disabled:opacity-40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-sm font-semibold" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increase}
              disabled={outOfStock || quantity >= max}
              aria-label="Aumentar cantidad"
              className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-ink disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-xs text-muted">
            {outOfStock ? "No disponible" : `Máx. ${max}`}
          </span>
        </div>
      </div>

      {/* Botones */}
      <div className="mt-6 space-y-3">
        <Button
          onClick={() => handleAdd(false)}
          disabled={outOfStock}
          size="lg"
          className="w-full"
        >
          <ShoppingBag className="h-4 w-4" />
          {outOfStock ? "Agotado" : "Añadir al carrito"}
        </Button>

        <Button
          onClick={() => handleAdd(true)}
          disabled={outOfStock}
          size="lg"
          variant="secondary"
          className="w-full"
        >
          <Zap className="h-4 w-4" />
          Comprar ahora
        </Button>
      </div>
    </div>
  );
}
