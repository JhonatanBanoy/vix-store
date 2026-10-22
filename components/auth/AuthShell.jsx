import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import Container from "../layout/Container";

const BENEFITS = [
  "Envíos a todo el país",
  "Pago seguro y confirmación por WhatsApp",
  "Devoluciones hasta 30 días",
];

export default function AuthShell({
  title,
  subtitle,
  sideTitle,
  sideText,
  children,
  footer,
}) {
  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-line bg-paper shadow-xl shadow-ink/5 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Panel de marca */}
        <aside className="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-brand-light/20 blur-3xl" />

          <div className="relative">
            <Link
              href="/"
              className="font-display text-2xl font-bold tracking-tight"
              aria-label="Vix — Inicio"
            >
              V<span className="text-brand-light">I</span>X
            </Link>

            <h2 className="mt-12 font-display text-3xl font-bold leading-tight">
              {sideTitle}
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
              {sideText}
            </p>
          </div>

          <ul className="relative mt-auto space-y-3 pt-12 text-sm text-white/80">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />
                {item}
              </li>
            ))}
          </ul>
        </aside>

        {/* Formulario */}
        <div className="p-6 sm:p-10">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}

          <div className="mt-7">{children}</div>

          {footer && (
            <div className="mt-6 border-t border-line pt-5 text-sm text-muted">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
