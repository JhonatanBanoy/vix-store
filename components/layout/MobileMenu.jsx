"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { X, LogOut, User, LayoutDashboard } from "lucide-react";

const links = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/products" },
  { label: "Ofertas", href: "/products?filter=ofertas" },
  { label: "Contacto", href: "/contact" },
  { label: "Carrito", href: "/cart" },
];

const categories = [
  { label: "Audífonos", href: "/products?category=audifonos" },
  { label: "Tecnología", href: "/products?category=tecnologia" },
  { label: "Moda hombre", href: "/products?category=moda-hombre" },
  { label: "Moda mujer", href: "/products?category=moda-mujer" },
  { label: "Hogar", href: "/products?category=hogar" },
];

export default function MobileMenu({ open, onClose }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user")));
      setRole(localStorage.getItem("role"));
    } catch {
      setUser(null);
    }
  }, [open]);

  // Bloquea el scroll del fondo cuando el menú está abierto
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Cierra con la tecla Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setUser(null);
    setRole(null);
    onClose();
    router.push("/");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[85%] max-w-sm overflow-y-auto bg-paper shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menú de navegación"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Link
            href="/"
            onClick={onClose}
            className="font-display text-2xl font-bold tracking-tight"
          >
            V<span className="text-brand">I</span>X
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-bone hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cuenta */}
        <div className="border-b border-line px-5 py-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
                <User className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user.name || "Mi cuenta"}
                </p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="text-sm font-semibold text-brand"
            >
              Iniciar sesión
            </Link>
          )}
        </div>

        {/* Links */}
        <nav className="px-3 py-3">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={onClose}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bone"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Categorías */}
        <div className="border-t border-line px-3 py-3">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-muted">
            Categorías
          </p>
          {categories.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              onClick={onClose}
              className="block rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-bone hover:text-ink"
            >
              {c.label}
            </Link>
          ))}
        </div>

        {/* Acciones de cuenta */}
        {user && (
          <div className="border-t border-line px-3 py-3">
            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-ink transition-colors hover:bg-bone"
            >
              <User className="h-4 w-4" /> Mi perfil
            </Link>
            {role === "admin" && (
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-ink transition-colors hover:bg-bone"
              >
                <LayoutDashboard className="h-4 w-4" /> Panel admin
              </Link>
            )}
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-danger transition-colors hover:bg-danger/5"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
