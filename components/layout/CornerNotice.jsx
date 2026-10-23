"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Sparkles, X } from "lucide-react";

import { cn } from "../../lib/utils";

const BENEFITS = [
  {
    text: "Envío gratis a todo el país.",
    href: "/products",
    cta: "Ver productos",
  },
  {
    text: "Atención personalizada por WhatsApp.",
    href: "/contact",
    cta: "Contáctanos",
  },
  {
    text: "Descubre lo nuevo de Vix.",
    href: "/products",
    cta: "Ver novedades",
  },
  {
    text: "Elige tu favorito y escríbenos.",
    href: "/products",
    cta: "Ver productos",
  },
];

const HIDDEN_ROUTES = [
  "/dashboard",
  "/login",
  "/register",
  "/checkout",
  "/cart",
  "/profile",
];

export default function CornerNotice({ products = [] }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  const messages = useMemo(() => {
    const featured = (Array.isArray(products) ? products : [])
      .filter((product) => product?.id && product?.name)
      .slice(0, 2)
      .map((product) => {
        const name =
          product.name.length > 30
            ? `${product.name.slice(0, 30)}…`
            : product.name;

        return {
          text: `Nuevo ingreso: ${name}.`,
          href: `/products/${product.id}`,
          cta: "Ver producto",
        };
      });

    if (!featured.length) return BENEFITS;

    // Alterna producto → beneficio → producto → beneficio.
    const mixed = [];
    for (let index = 0; index < featured.length; index += 1) {
      mixed.push(featured[index]);
      if (BENEFITS[index]) mixed.push(BENEFITS[index]);
    }

    return mixed;
  }, [products]);

  // Si la lista cambia de tamaño, vuelve al primer mensaje.
  useEffect(() => {
    if (messageIndex >= messages.length) {
      setMessageIndex(0);
      setTyped("");
      setDeleting(false);
    }
  }, [messageIndex, messages.length]);

  const hidden = HIDDEN_ROUTES.some((route) => pathname?.startsWith(route));

  // Preferencia de movimiento reducido.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);

    const onChange = (event) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);

    return () => query.removeEventListener("change", onChange);
  }, []);

  // Recuerda si el usuario lo cerró en esta sesión.
  useEffect(() => {
    try {
      if (sessionStorage.getItem("vix-notice-dismissed") === "1") {
        setDismissed(true);
      }
    } catch {
      // sessionStorage puede no estar disponible.
    }
  }, []);

  // Aparece con un pequeño retraso para no competir con la carga inicial.
  useEffect(() => {
    if (hidden || dismissed) return;

    const timer = setTimeout(() => setVisible(true), 2200);
    return () => clearTimeout(timer);
  }, [hidden, dismissed]);

  // Se recoge solo después de un rato; queda un botón discreto para reabrirlo.
  useEffect(() => {
    if (!visible || minimized) return;

    const timer = setTimeout(() => setMinimized(true), 20000);
    return () => clearTimeout(timer);
  }, [visible, minimized]);

  // Efecto máquina de escribir.
  useEffect(() => {
    if (reducedMotion || !visible || minimized || dismissed) return;

    const full = messages[messageIndex]?.text || "";
    if (!full) return;

    if (!deleting) {
      if (typed.length < full.length) {
        const timer = setTimeout(
          () => setTyped(full.slice(0, typed.length + 1)),
          38
        );
        return () => clearTimeout(timer);
      }

      const timer = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(timer);
    }

    if (typed.length > 0) {
      const timer = setTimeout(
        () => setTyped(full.slice(0, typed.length - 1)),
        16
      );
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setDeleting(false);
      setMessageIndex((index) => (index + 1) % messages.length);
      setTyped("");
    }, 180);

    return () => clearTimeout(timer);
  }, [
    typed,
    deleting,
    messageIndex,
    reducedMotion,
    visible,
    minimized,
    dismissed,
    messages,
  ]);

  // Con movimiento reducido se muestra el texto completo y rota sin teclear.
  useEffect(() => {
    if (!reducedMotion || !visible || minimized || dismissed) return;

    const timer = setInterval(() => {
      setMessageIndex((index) => (index + 1) % messages.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [reducedMotion, visible, minimized, dismissed, messages]);

  const dismiss = () => {
    setDismissed(true);
    setVisible(false);

    try {
      sessionStorage.setItem("vix-notice-dismissed", "1");
    } catch {
      // Sin sessionStorage, simplemente se oculta.
    }
  };

  const goToMessage = (index) => {
    setMessageIndex(index);
    setTyped("");
    setDeleting(false);
  };

  if (hidden || dismissed) return null;

  const current = messages[messageIndex] || messages[0];
  const displayed = reducedMotion ? current.text : typed;

  return (
    <>
      <div
        className={cn(
          "fixed bottom-5 left-4 z-40 w-[340px] max-w-[calc(100vw_-_6.5rem)] transition-all duration-500 sm:left-5",
          visible && !minimized
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        )}
        inert={!visible || minimized}
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink p-4 text-white shadow-2xl shadow-ink/30">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-brand/40 blur-2xl"
          />

          <div className="relative flex items-start gap-3">
            <p className="sr-only" aria-live="polite">
              {current.text}
            </p>

            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-lg shadow-brand/30">
              <Sparkles className="h-4 w-4" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                  Novedades Vix
                </p>

                <button
                  type="button"
                  onClick={dismiss}
                  aria-label="Cerrar aviso"
                  className="-mr-1 -mt-1 grid h-7 w-7 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <p
                className="mt-1.5 min-h-[2.5rem] text-sm font-medium leading-snug"
                aria-hidden="true"
              >
                {displayed}
                {!reducedMotion && (
                  <span
                    aria-hidden="true"
                    className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-[2px] animate-caret bg-brand-light"
                  />
                )}
              </p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <Link
                  href={current.href}
                  className="group inline-flex items-center gap-1 text-xs font-semibold text-brand-light transition-colors hover:text-white"
                >
                  {current.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <div className="flex items-center gap-1.5">
                  {messages.map((message, index) => (
                    <button
                      key={`${message.text}-${index}`}
                      type="button"
                      onClick={() => goToMessage(index)}
                      aria-label={`Ver mensaje ${index + 1}`}
                      aria-current={index === messageIndex}
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        index === messageIndex
                          ? "w-4 bg-brand-light"
                          : "w-1.5 bg-white/25 hover:bg-white/50"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setMinimized(false)}
        aria-label="Abrir novedades"
        inert={!visible || !minimized}
        className={cn(
          "fixed bottom-5 left-4 z-40 flex h-12 items-center gap-2 rounded-full bg-ink px-4 text-xs font-semibold text-white shadow-lg shadow-ink/25 transition-all duration-300 hover:bg-brand sm:left-5",
          visible && minimized
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        )}
      >
        <Sparkles className="h-4 w-4 text-brand-light" />
        Novedades
      </button>
    </>
  );
}
