import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import Container from "../layout/Container";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import HeroCarousel from "./HeroCarousel";
import { formatPrice } from "../../lib/utils";

export default function Hero({ products = [] }) {
  const active = products.filter((product) => product.isActive);
  const prices = active
    .map((product) => Number(product.price))
    .filter((price) => price > 0);
  const from = prices.length ? Math.min(...prices) : null;

  return (
    <section className="relative overflow-hidden bg-bone">
      <Container className="grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
        {/* Texto */}
        <div>
          <Badge variant="soft">
            <Sparkles className="h-3 w-3" /> Nueva temporada
          </Badge>

          <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            Lo que buscas,{" "}
            <span className="text-brand">al mejor precio.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            Tecnología, moda y hogar en un solo lugar. Productos seleccionados
            con envío seguro a todo el país.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products">
              <Button size="lg">
                Ver productos <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/products?offers=1">
              <Button variant="outline" size="lg">
                Ver ofertas
              </Button>
            </Link>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">
                Envíos
              </dt>
              <dd className="mt-1 font-display text-xl font-bold">Nacional</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">
                Productos
              </dt>
              <dd className="mt-1 font-display text-xl font-bold">
                {active.length || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">
                Garantía
              </dt>
              <dd className="mt-1 font-display text-xl font-bold">30 días</dd>
            </div>
          </dl>

          {from && (
            <p className="mt-4 text-sm text-muted">
              Encuentra productos desde{" "}
              <span className="font-semibold text-ink">
                {formatPrice(from)}
              </span>
            </p>
          )}
        </div>

        {/* Visual */}
        <HeroCarousel products={active} />
      </Container>
    </section>
  );
}
