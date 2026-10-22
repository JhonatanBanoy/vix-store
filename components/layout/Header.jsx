"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  ChevronDown,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import Container from "./Container";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const router = useRouter();
  const { cartItems } = useCart();

  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const accountRef = useRef(null);

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Lee el usuario guardado
  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user")));
      setRole(localStorage.getItem("role"));
    } catch {
      setUser(null);
    }
  }, []);

  // Cierra el menú de cuenta al hacer clic fuera
  useEffect(() => {
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setUser(null);
    setRole(null);
    setAccountOpen(false);
    router.push("/");
  };

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
        <Container className="flex h-16 items-center gap-2 sm:gap-4">
          {/* Menú móvil */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            className="-ml-2 rounded-lg p-2 text-ink transition-colors hover:bg-bone lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 font-display text-2xl font-bold tracking-tight"
            aria-label="Vix — Inicio"
          >
            V<span className="text-brand">I</span>X
          </Link>

          {/* Buscador escritorio */}
          <form onSubmit={handleSearch} className="relative hidden flex-1 md:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos, marcas y más..."
              aria-label="Buscar productos"
              className="h-11 w-full rounded-xl border border-line bg-bone/60 pl-11 pr-28 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:bg-paper focus:ring-2 focus:ring-brand/15"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 h-8 rounded-lg bg-ink px-4 text-xs font-semibold text-white transition-colors hover:bg-ink/90"
            >
              Buscar
            </button>
          </form>

          {/* Acciones */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Cuenta */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink transition-colors hover:bg-bone"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
              >
                <User className="h-5 w-5" />
                <span className="hidden max-w-[120px] truncate lg:inline">
                  {user?.name ? user.name.split(" ")[0] : "Ingresar"}
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-muted lg:inline" />
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-paper py-1 shadow-lg"
                >
                  {user ? (
                    <>
                      <div className="border-b border-line px-4 py-3">
                        <p className="truncate text-sm font-semibold">{user.name}</p>
                        <p className="truncate text-xs text-muted">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm transition-colors hover:bg-bone"
                      >
                        Mi perfil
                      </Link>
                      {role === "admin" && (
                        <Link
                          href="/dashboard"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-bone"
                        >
                          <LayoutDashboard className="h-4 w-4" /> Panel admin
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-danger transition-colors hover:bg-danger/5"
                      >
                        <LogOut className="h-4 w-4" /> Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-bone"
                      >
                        Iniciar sesión
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm transition-colors hover:bg-bone"
                      >
                        Crear cuenta
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Carrito */}
            <Link
              href="/cart"
              className="relative rounded-lg p-2 text-ink transition-colors hover:bg-bone"
              aria-label={`Carrito (${cartCount} productos)`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </Container>

        {/* Buscador móvil */}
        <div className="border-t border-line px-4 py-2 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              className="h-10 w-full rounded-xl border border-line bg-bone/60 pl-10 pr-4 text-sm outline-none placeholder:text-muted/70 focus:border-brand focus:bg-paper"
            />
          </form>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
