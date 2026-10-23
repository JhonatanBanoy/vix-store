"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Loader2,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import Container from "../layout/Container";
import Breadcrumbs from "../catalog/Breadcrumbs";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ProductImage from "../ui/ProductImage";
import { useCart } from "../../context/CartContext";
import { api } from "../../lib/api";
import { cn, formatPrice } from "../../lib/utils";
import { CITIES, DEPARTMENTS } from "../../lib/colombia";
import { whatsappLink } from "../../lib/contact";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  department: "",
  city: "",
  address: "",
  neighborhood: "",
  notes: "",
};

export default function CheckoutClient() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState(EMPTY_FORM);
  const [config, setConfig] = useState({
    loading: true,
    wompiEnabled: false,
    codEnabled: true,
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [quote, setQuote] = useState({
    rate: null,
    zone: null,
    loading: false,
    error: null,
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Prellena nombre y correo si la persona ya tiene sesión, sin exigir login.
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setForm((prev) => ({
          ...prev,
          name: prev.name || user.name || "",
          email: prev.email || user.email || "",
        }));
      }
    } catch {
      /* compra como invitado */
    }
  }, []);

  // Solo mostramos Wompi cuando sus llaves están configuradas en el backend.
  useEffect(() => {
    let active = true;
    api
      .get("/payments/config")
      .then(({ data }) => {
        if (!active) return;
        const next = {
          loading: false,
          wompiEnabled: Boolean(data.wompiEnabled),
          codEnabled: data.codEnabled !== false,
        };
        setConfig(next);
        if (next.wompiEnabled) setPaymentMethod("wompi");
        else if (next.codEnabled) setPaymentMethod("cod");
        else setPaymentMethod("");
      })
      .catch(() => {
        if (active) {
          setConfig({ loading: false, wompiEnabled: false, codEnabled: true });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  // El envío lo calcula el backend según la ciudad.
  useEffect(() => {
    const city = form.city.trim();

    if (city.length < 3) {
      setQuote({ rate: null, zone: null, loading: false, error: null });
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setQuote((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const { data } = await api.get("/shipping/quote", {
          params: { city, department: form.department },
          signal: controller.signal,
        });
        setQuote({
          rate: data.rate,
          zone: data.zoneLabel,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (controller.signal.aborted) return;
        setQuote({
          rate: null,
          zone: null,
          loading: false,
          error: "No pudimos calcular el envío. Revisa tu ciudad.",
        });
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [form.city, form.department]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const shipping = quote.rate ?? 0;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!cartItems.length) return;

    if (quote.rate === null) {
      setError("Ingresa tu ciudad para calcular el envío antes de pagar.");
      return;
    }

    if (!paymentMethod) {
      setError("No hay un método de pago disponible en este momento.");
      return;
    }

    setSending(true);

    try {
      const { data } = await api.post("/orders/guest", {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        shippingAddress: {
          department: form.department,
          city: form.city,
          address: form.address,
          neighborhood: form.neighborhood,
          notes: form.notes,
        },
        paymentMethod,
      });

      if (data.checkoutUrl) {
        // Wompi: el carrito se conserva hasta confirmar el pago.
        window.location.assign(data.checkoutUrl);
        return;
      }

      if (data.redirectUrl) {
        clearCart();
        router.push(data.redirectUrl);
        return;
      }

      setError("No pudimos iniciar el pedido. Intenta de nuevo.");
      setSending(false);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "No pudimos crear tu pedido. Revisa los datos e intenta de nuevo.";
      setError(message);
      setSending(false);
    }
  };

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

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Finalizar compra</h1>
          <p className="mt-1 text-sm text-muted">
            Compra como invitado, sin crear cuenta. Te enviaremos la
            confirmación a tu correo.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-3 py-1.5 text-xs font-medium text-success">
          <ShieldCheck className="h-4 w-4" />
          Pago seguro
        </span>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
        <form
          onSubmit={handleSubmit}
          className="order-2 rounded-2xl border border-line bg-paper p-5 sm:p-6 lg:order-1"
        >
          {/* Datos de contacto */}
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <h2 className="font-display text-lg font-bold">Datos de contacto</h2>
          </div>

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
                autoComplete="name"
                required
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@correo.com"
                autoComplete="email"
                required
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm font-medium">
                Teléfono / WhatsApp
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="300 000 0000"
                autoComplete="tel"
                required
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="mt-8 border-t border-line pt-7">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand">
                <Truck className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold">
                  Dirección de entrega
                </h2>
                <p className="text-xs text-muted">
                  El envío se calcula según tu ciudad.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="department" className="text-sm font-medium">
                  Departamento
                </label>
                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  className="mt-1.5 h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                >
                  <option value="">Selecciona tu departamento</option>
                  {DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="city" className="text-sm font-medium">
                  Ciudad o municipio
                </label>
                <Input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Ej. Bogotá"
                  autoComplete="address-level2"
                  list="vix-cities"
                  required
                  className="mt-1.5"
                />
                <datalist id="vix-cities">
                  {CITIES.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
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
                  placeholder="Calle 123 #45-67"
                  autoComplete="street-address"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <label htmlFor="neighborhood" className="text-sm font-medium">
                  Barrio / referencia{" "}
                  <span className="text-muted">(opcional)</span>
                </label>
                <Input
                  id="neighborhood"
                  name="neighborhood"
                  value={form.neighborhood}
                  onChange={handleChange}
                  placeholder="Ej. Chapinero"
                  className="mt-1.5"
                />
              </div>

              <div>
                <label htmlFor="notes" className="text-sm font-medium">
                  Indicaciones{" "}
                  <span className="text-muted">(opcional)</span>
                </label>
                <Input
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Apto, torre, horario de entrega..."
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="mt-4 flex min-h-10 items-center gap-2 rounded-xl bg-bone/70 px-3 py-2 text-xs">
              {quote.loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-brand" />
                  <span className="text-muted">Calculando envío...</span>
                </>
              ) : quote.rate !== null ? (
                <>
                  <Truck className="h-4 w-4 text-brand" />
                  <span className="text-muted">
                    Envío a {quote.zone}:{" "}
                    <strong className="font-semibold text-ink">
                      {formatPrice(quote.rate)}
                    </strong>
                  </span>
                </>
              ) : quote.error ? (
                <span className="text-danger">{quote.error}</span>
              ) : (
                <span className="text-muted">
                  Escribe tu ciudad para ver el costo del envío.
                </span>
              )}
            </div>
          </div>

          {/* Pago */}
          <div className="mt-8 border-t border-line pt-7">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand">
                <LockKeyhole className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold">Pago</h2>
                <p className="text-xs text-muted">
                  Elige cómo quieres pagar tu pedido.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {config.loading ? (
                <div className="flex items-center gap-2 rounded-xl border border-line bg-bone/60 px-4 py-3 text-sm text-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando métodos de pago...
                </div>
              ) : null}

              {config.wompiEnabled ? (
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                    paymentMethod === "wompi"
                      ? "border-brand bg-brand-soft/40"
                      : "border-line hover:bg-bone/60"
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wompi"
                    checked={paymentMethod === "wompi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 h-4 w-4 accent-[#5B3DF5]"
                  />
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper text-brand shadow-sm">
                    <CreditCard className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold">
                        Pago en línea
                      </span>
                      <span className="rounded-full bg-paper px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                        Wompi
                      </span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">
                      Tarjetas, PSE y Nequi. Serás dirigido al checkout seguro
                      de Wompi.
                    </span>
                    <span className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-medium text-muted">
                      <span className="rounded border border-line bg-paper px-1.5 py-0.5">
                        Tarjetas
                      </span>
                      <span className="rounded border border-line bg-paper px-1.5 py-0.5">
                        PSE
                      </span>
                      <span className="rounded border border-line bg-paper px-1.5 py-0.5">
                        Nequi
                      </span>
                    </span>
                  </span>
                </label>
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-deal/30 bg-deal/5 p-4 text-sm">
                  <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                  <p className="text-muted">
                    <strong className="font-semibold text-ink">
                      Pago en línea próximamente.
                    </strong>{" "}
                    Estamos activando Wompi. Por ahora puedes pagar contra
                    entrega.
                  </p>
                </div>
              )}

              {config.codEnabled ? (
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                    paymentMethod === "cod"
                      ? "border-brand bg-brand-soft/40"
                      : "border-line hover:bg-bone/60"
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 h-4 w-4 accent-[#5B3DF5]"
                  />
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper text-brand shadow-sm">
                    <Banknote className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-sm font-semibold">
                      Pago contra entrega
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">
                      Pagas en efectivo cuando recibas tu pedido. Te
                      contactaremos para coordinar la entrega.
                    </span>
                  </span>
                </label>
              ) : null}

              {!config.loading &&
              !config.wompiEnabled &&
              !config.codEnabled ? (
                <p className="rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
                  No hay métodos de pago disponibles. Escríbenos para ayudarte.
                </p>
              ) : null}
            </div>
          </div>

          {error ? (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
            >
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={
              sending ||
              quote.rate === null ||
              quote.loading ||
              !paymentMethod ||
              config.loading
            }
            className="mt-6 w-full"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : paymentMethod === "wompi" ? (
              <>
                <LockKeyhole className="h-4 w-4" />
                Pagar con Wompi
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Confirmar pedido
              </>
            )}
          </Button>

          <p className="mt-3 text-center text-xs leading-relaxed text-muted">
            {paymentMethod === "wompi"
              ? "Serás dirigido a Wompi para completar el pago. No almacenamos datos de tu tarjeta."
              : "No se realiza ningún cobro ahora. Pagas al recibir tu pedido."}
          </p>

          <p className="mt-2 text-center text-xs text-muted">
            ¿Dudas con tu pedido?{" "}
            <a
              href={whatsappLink(
                "Hola Vix, necesito ayuda con mi compra en la tienda."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-brand hover:underline"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Escríbenos por WhatsApp
            </a>
          </p>
        </form>

        {/* Resumen */}
        <aside className="order-1 lg:sticky lg:top-24 lg:order-2 lg:self-start">
          <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold">
                Tu pedido{" "}
                <span className="text-sm font-normal text-muted">
                  ({count})
                </span>
              </h2>
              <span className="rounded-full bg-bone px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                Invitado
              </span>
            </div>

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
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted">Envío</span>
                <span className="text-right font-medium">
                  {quote.loading
                    ? "Calculando..."
                    : quote.rate !== null
                      ? formatPrice(quote.rate)
                      : "Por calcular"}
                </span>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-xl bg-bone/60 p-3 text-xs text-muted">
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0 text-brand" />
                Envío calculado según tu ciudad
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-brand" />
                Compra protegida y confirmación por correo
              </p>
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
