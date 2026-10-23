import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Container from "../layout/Container";
import Button from "../ui/Button";

export default function PromoBanner() {
  return (
    <section className="py-12">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-white sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-24 h-56 w-56 rounded-full bg-deal/20 blur-3xl" />

          <div className="relative max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-light">
              Ofertas de la semana
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Hasta 30% de descuento en tecnología
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
              Audífonos, accesorios y más. Aprovecha antes de que se agoten.
            </p>

            <Link href="/products?offers=1" className="mt-7 inline-block">
              <Button variant="deal" size="lg">
                Ver ofertas <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
