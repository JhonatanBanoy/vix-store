import Link from "next/link";
import { CreditCard, ShieldCheck, Truck, RotateCcw } from "lucide-react";

import Container from "./Container";

const columns = [
  {
    title: "Tienda",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Productos", href: "/products" },
      { label: "Ofertas", href: "/products?offers=1" },
      { label: "Carrito", href: "/cart" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { label: "Contacto", href: "/contact" },
      { label: "Envíos", href: "/contact" },
      { label: "Devoluciones", href: "/contact" },
      { label: "Preguntas frecuentes", href: "/contact" },
    ],
  },
  {
    title: "Mi cuenta",
    links: [
      { label: "Iniciar sesión", href: "/login" },
      { label: "Crear cuenta", href: "/register" },
      { label: "Mi perfil", href: "/profile" },
    ],
  },
];

const trust = [
  { icon: Truck, label: "Envíos a todo el país" },
  { icon: ShieldCheck, label: "Pago 100% seguro" },
  { icon: RotateCcw, label: "Devoluciones fáciles" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white">
      {/* Barra de confianza */}
      <div className="border-b border-white/10">
        <Container className="grid gap-4 py-6 sm:grid-cols-3">
          {trust.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm text-white/80">{label}</span>
            </div>
          ))}
        </Container>
      </div>

      {/* Columnas */}
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight">
            V<span className="text-brand-light">I</span>X
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-white/60">
            Tecnología, moda y estilo de vida. Productos seleccionados con envío
            seguro a todo el país.
          </p>
          <div className="flex items-center gap-2 text-white/50">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">Pagos seguros</span>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-white/90">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      {/* Legal */}
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Vix. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5">
            <Link href="/contact" className="transition-colors hover:text-white">
              Privacidad
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Términos
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contacto
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
