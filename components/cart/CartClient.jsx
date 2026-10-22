"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import Container from "../layout/Container";
import Breadcrumbs from "../catalog/Breadcrumbs";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { useCart } from "../../context/CartContext";

export default function CartClient() {
  const { cartItems, clearCart } = useCart();
  const [confirming, setConfirming] = useState(false);

  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[{ label: "Inicio", href: "/" }, { label: "Carrito" }]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-bold sm:text-3xl">Tu carrito</h1>
        <p className="mt-1 text-sm text-muted">
          {count > 0
            ? `${count} ${count === 1 ? "producto" : "productos"} en tu carrito`
            : "Aún no tienes productos"}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-bone/50 px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper text-muted shadow-sm">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <h2 className="mt-5 font-display text-lg font-bold">
            Tu carrito está vacío
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Explora el catálogo y agrega los productos que te gusten.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand/90"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Lista */}
          <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            <div className="border-t border-line pt-4">
              {confirming ? (
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="text-muted">¿Vaciar el carrito?</span>
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      setConfirming(false);
                    }}
                    className="font-semibold text-danger hover:underline"
                  >
                    Sí, vaciar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="text-muted hover:text-ink"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="text-sm text-muted transition-colors hover:text-danger"
                >
                  Vaciar carrito
                </button>
              )}
            </div>
          </div>

          <CartSummary />
        </div>
      )}
    </Container>
  );
}
