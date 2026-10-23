import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import Container from "../layout/Container";
import ClearCartOnMount from "./ClearCartOnMount";
import PaymentStatusRefresher from "./PaymentStatusRefresher";
import { API_URL } from "../../lib/api";
import { CONTACT, whatsappLink } from "../../lib/contact";
import { formatPrice } from "../../lib/utils";

async function fetchOrder(token) {
  try {
    const response = await fetch(
      `${API_URL}/api/orders/guest/token/${encodeURIComponent(token)}`,
      { cache: "no-store" }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.order || null;
  } catch {
    return null;
  }
}

async function syncPayment(token, transactionId) {
  if (!token || !transactionId) return;
  try {
    await fetch(`${API_URL}/api/orders/wompi/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, transactionId }),
      cache: "no-store",
    });
  } catch {
    // El webhook sigue siendo la fuente principal; si falla, se reintenta.
  }
}

function ErrorState() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-bone text-muted">
          <XCircle className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold">
          No encontramos este pedido
        </h1>
        <p className="mt-3 text-muted">
          Puede que el enlace haya vencido. Escríbenos y revisamos tu compra.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand/90"
          >
            Ver productos
          </Link>
          <a
            href={whatsappLink("Hola Vix, necesito ayuda con un pedido.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-paper px-6 text-sm font-medium transition-colors hover:bg-bone"
          >
            <MessageCircle className="h-4 w-4" />
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </Container>
  );
}

export default async function OrderSuccess({ token, transactionId }) {
  const safeToken = typeof token === "string" ? token.trim() : "";
  const safeTransactionId =
    typeof transactionId === "string" ? transactionId.trim() : "";

  if (!safeToken) return <ErrorState />;

  if (safeTransactionId) {
    await syncPayment(safeToken, safeTransactionId);
  }

  const order = await fetchOrder(safeToken);
  if (!order) return <ErrorState />;

  const isCod = order.paymentMethod === "cod";
  const isApproved = order.paymentStatus === "approved";
  const isPending = order.paymentStatus === "pending";
  const wompiPending = !isCod && isPending;

  const succeeded = isCod || isApproved;
  const needsReview = order.paymentStatus === "error" && order.isPaid;

  const title = succeeded
    ? isCod
      ? "¡Pedido recibido!"
      : "¡Pago aprobado!"
    : wompiPending
      ? "Estamos confirmando tu pago"
      : needsReview
        ? "Pago recibido, pedido en revisión"
        : "No pudimos completar el pago";

  const message = succeeded
    ? isCod
      ? "Tu pedido quedó registrado. Te contactaremos para coordinar la entrega y el pago contra entrega."
      : "Recibimos tu pago correctamente. Prepararemos tu pedido y te avisaremos cuando salga."
    : wompiPending
      ? "Wompi todavía está procesando la transacción. Esta página se actualiza automáticamente."
      : needsReview
        ? "El pago llegó, pero el valor no coincide con el pedido. Te escribiremos para solucionarlo."
        : "La transacción no fue aprobada. No se realizó ningún cobro; puedes intentarlo de nuevo.";

  const supportMessage = whatsappLink(
    `Hola Vix, necesito ayuda con el pedido ${order.reference}.`
  );

  const clearCart = isCod || isApproved;

  return (
    <Container className="py-12">
      <ClearCartOnMount enabled={clearCart} />
      <PaymentStatusRefresher enabled={wompiPending} />

      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span
            className={
              succeeded
                ? "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success"
                : isPending
                  ? "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-deal/20 text-ink"
                  : "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger"
            }
          >
            {succeeded ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : isPending ? (
              <Clock3 className="h-8 w-8" />
            ) : (
              <XCircle className="h-8 w-8" />
            )}
          </span>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Pedido {order.reference}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted">
            {message}
          </p>

          {wompiPending ? (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-bone px-3 py-1.5 text-xs text-muted">
              <Clock3 className="h-3.5 w-3.5" />
              Actualizando cada 5 segundos
            </p>
          ) : null}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-[1.15fr_0.85fr]">
          {/* Resumen */}
          <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold">Resumen</h2>
              {order.isPaid ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-success">
                  <ShieldCheck className="h-3 w-3" />
                  Pagado
                </span>
              ) : (
                <span className="rounded-full bg-bone px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {isCod ? "Contra entrega" : "Pendiente"}
                </span>
              )}
            </div>

            <ul className="mt-4 divide-y divide-line">
              {order.items.map((item) => (
                <li
                  key={`${item.productId}-${item.name}`}
                  className="flex justify-between gap-3 py-3 text-sm"
                >
                  <span className="text-muted">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-2 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Envío</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Entrega */}
          <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold">
              <Truck className="h-5 w-5 text-brand" />
              Entrega
            </h2>
            <div className="mt-4 space-y-1 text-sm">
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-muted">{order.shippingAddress.address}</p>
              {order.shippingAddress.neighborhood ? (
                <p className="text-muted">
                  {order.shippingAddress.neighborhood}
                </p>
              ) : null}
              <p className="text-muted">
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.department}
              </p>
              <p className="text-muted">{order.customer.phone}</p>
              <p className="break-all text-muted">{order.customer.email}</p>
              {order.shippingAddress.notes ? (
                <p className="pt-2 text-xs text-muted">
                  <span className="font-medium text-ink">Indicaciones:</span>{" "}
                  {order.shippingAddress.notes}
                </p>
              ) : null}
            </div>

            <div className="mt-5 border-t border-line pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Pago
              </p>
              <p className="mt-1 text-sm font-medium">
                {isCod ? "Pago contra entrega" : "Wompi · Pago en línea"}
              </p>
            </div>
          </div>
        </div>

        {/* Soporte */}
        <div className="mt-5 rounded-2xl border border-line bg-bone/60 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-base font-bold">
                ¿Dudas sobre tu entrega?
              </h2>
              <p className="mt-1 text-sm text-muted">
                Escríbenos con tu número de pedido y te ayudamos con la
                dirección, el tiempo de entrega o cualquier cambio.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <a
                href={supportMessage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(
                  `Pedido ${order.reference}`
                )}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-paper px-4 text-sm font-medium transition-colors hover:bg-bone"
              >
                <Mail className="h-4 w-4" />
                Correo
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand/90"
          >
            Seguir comprando
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-paper px-6 text-sm font-medium transition-colors hover:bg-bone"
          >
            <ShoppingBag className="h-4 w-4" />
            Ir al inicio
          </Link>
        </div>
      </div>
    </Container>
  );
}
