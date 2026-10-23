"use client";

import Link from "next/link";

import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/utils";

export default function CartSummary() {
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold">Resumen del pedido</h2>

        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-medium">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Envío</dt>
            <dd className="text-muted">Según tu ciudad</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="text-base font-bold">Total productos</span>
          <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
        </div>

        <Link
          href="/checkout"
          className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-brand text-base font-medium text-white shadow-sm transition-colors hover:bg-brand/90"
        >
          Finalizar compra
        </Link>

        <Link
          href="/products"
          className="mt-3 flex h-11 w-full items-center justify-center rounded-xl border border-line text-sm font-medium transition-colors hover:bg-bone"
        >
          Seguir comprando
        </Link>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          El costo de envío se calcula en el checkout según tu ciudad. Compra
          como invitado, sin crear cuenta.
        </p>
      </div>
    </aside>
  );
}
