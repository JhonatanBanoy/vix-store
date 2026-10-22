import Link from "next/link";
import { PackageX } from "lucide-react";

import Container from "../components/layout/Container";

export const metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <PackageX className="h-7 w-7" />
      </div>

      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-brand">
        Error 404
      </p>

      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
        No encontramos esta página
      </h1>

      <p className="mt-3 max-w-md text-muted">
        Puede que el producto ya no esté disponible o que el enlace esté mal
        escrito.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/products"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-7 text-base font-medium text-white shadow-sm transition-colors hover:bg-brand/90"
        >
          Ver productos
        </Link>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-line bg-paper px-7 text-base font-medium text-ink transition-colors hover:bg-bone"
        >
          Ir al inicio
        </Link>
      </div>
    </Container>
  );
}
