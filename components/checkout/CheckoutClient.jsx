"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, CheckCircle2, ShoppingBag } from "lucide-react";

import Container from "../layout/Container";
import Breadcrumbs from "../catalog/Breadcrumbs";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ProductImage from "../ui/ProductImage";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/utils";
import { whatsappLink } from "../../lib/contact";

const EMPTY_FORM = {
  name: "",
  phone: "",
  address: "",
  city: "",
  notes: "",
};

export default function CheckoutClient() {
  const { cartItems, clearCart } = useCart();

  const [form, setForm] = useState(EMPTY_FORM);
  const [order, setOrder] = useState(null);
  const [sending, setSending] = useState(false);

  // Prellena el nombre si el usuario ya inició sesión
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.name) {
        setForm((prev) => ({ ...prev, name: prev.name || user.name }));
      }
    } catch {
      /* sin sesión */
    }
  }, []);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cartItems.length) return;

    setSending(true);

    const ref = `VIX-${Math.floor(100000 + Math.random() * 900000)}`;

    const lines = cartItems.map(
      (item, i) =>
        `${i + 1}. ${item.name} x${item.quantity} — ${formatPrice(
          item.price * item.quantity
        )}`
    );

    const message = [
      `🛒 *Nuevo pedido — Vix*`,
      `*Pedido:* ${ref}`,
      "",
      `*Nombre:* ${form.name}`,
      `*Teléfono:* ${form.phone}`,
      `*Dirección:* ${form.address}`,
      `*Ciudad:* ${form.city}`,
      form.notes ? `*Notas:* ${form.notes}` : null,
      "",
      "*Productos:*",
      ...lines,
      "",
      `*Total:* ${formatPrice(total)}`,
      "",
      "Quedo atento para confirmar el envío. ¡Gracias!",
    ]
      .filter(Boolean)
      .join("\n");

    // Guardamos una copia antes de vaciar el carrito
    setOrder({ ref, items: cartItems, total, form });

    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");

    clearCart();
    setSending(false);
  };

  /* ---------- Pedido confirmado ---------- */
  if (order) {
    return (
      <Container className="py-12">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </span>

          <h1 className="mt-6 font-display text-3xl font-bold">
            ¡Pedido listo!
          </h1>
          <p className="mt-3 text-muted">
            Abrimos WhatsApp con el resumen de tu pedido{" "}
            <span className="font-semibold text-ink">{order.ref}</span>. Envía el
            mensaje para que lo confirmemos.
          </p>

          <div className="mt-8 rounded-2xl border border-line bg-paper p-5 text-left">
            <h2 className="text-sm font-semibold">Resumen</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3">
                  <span className="text-muted">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-line pt-3 text-sm font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand/90"
            >
              Seguir comprando
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-line bg-paper px-6 text-sm font-medium transition-colors hover:bg-bone"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  /* ---------- Carrito vacío ---------- */
  if (!cartItems.length) {
    return (
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Carrito", href: "/cart" },
            { label: "Finalizar compra" },
          ]}
        />

        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-bone/50 px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper text-muted shadow-sm">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-display text-lg font-bold">
            No hay nada para pagar
          </h1>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Agrega productos al carrito para continuar con tu pedido.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand/90"
          >
            Ver productos
          </Link>
        </div>
      </Container>
    );
  }

  /* ---------- Checkout ---------- */
  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Carrito", href: "/cart" },
          { label: "Finalizar compra" },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-bold sm:text-3xl">Finalizar compra</h1>
        <p className="mt-1 text-sm text-muted">
          Completa tus datos y confirma el pedido por WhatsApp.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line bg-paper p-5 sm:p-6"
        >
          <h2 className="font-display text-lg font-bold">Datos de envío</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nombre completo
              </label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm font-medium">
                Teléfono
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="300 000 0000"
                required
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="city" className="text-sm font-medium">
                Ciudad
              </label>
              <Input
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Bogotá"
                required
                className="mt-1.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="text-sm font-medium">
                Dirección
              </label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Calle 123 #45-67, barrio, referencias"
                required
                className="mt-1.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notas <span className="text-muted">(opcional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Indicaciones para la entrega"
                className="mt-1.5 w-full resize-y rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition-colors duration-200 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={sending}
            className="mt-6 w-full"
          >
            <MessageCircle className="h-4 w-4" />
            {sending ? "Preparando pedido..." : "Confirmar pedido por WhatsApp"}
          </Button>

          <p className="mt-3 text-center text-xs text-muted">
            No se realiza ningún cobro en línea. Coordinamos el pago y el envío
            por WhatsApp.
          </p>
        </form>

        {/* Resumen */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <h2 className="font-display text-lg font-bold">
              Tu pedido{" "}
              <span className="text-sm font-normal text-muted">({count})</span>
            </h2>

            <ul className="mt-4 divide-y divide-line">
              {cartItems.map((item) => (
                <li key={item.id} className="flex gap-3 py-3">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md border border-line bg-bone">
                    <ProductImage
                      src={item.image}
                      alt={item.name || "Producto"}
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-2 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Envío</span>
                <span className="text-muted">Por calcular</span>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/cart"
              className="mt-4 block text-center text-sm font-medium text-brand hover:underline"
            >
              Volver al carrito
            </Link>
          </div>
        </aside>
      </div>
    </Container>
  );
}
