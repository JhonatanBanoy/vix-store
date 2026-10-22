import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import Container from "../layout/Container";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

export default function Hero() {
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
            <Link href="/products?filter=ofertas">
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
              <dd className="mt-1 font-display text-xl font-bold">24/48h</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">
                Productos
              </dt>
              <dd className="mt-1 font-display text-xl font-bold">+500</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">
                Garantía
              </dt>
              <dd className="mt-1 font-display text-xl font-bold">30 días</dd>
            </div>
          </dl>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-brand to-ink">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "22px 22px",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <span className="font-display text-6xl font-bold tracking-tight text-white sm:text-7xl">
                V<span className="text-deal">I</span>X
              </span>
              <span className="text-[11px] uppercase tracking-[0.35em] text-white/70">
                Nueva colección
              </span>
            </div>
          </div>

          <div className="absolute -left-3 top-10 rounded-xl border border-line bg-paper px-4 py-3 shadow-lg sm:-left-6">
            <p className="text-[11px] uppercase tracking-wide text-muted">
              Envío
            </p>
            <p className="text-sm font-semibold text-success">Gratis</p>
          </div>

          <div className="absolute -right-3 bottom-12 rounded-xl border border-line bg-paper px-4 py-3 shadow-lg sm:-right-6">
            <p className="text-[11px] uppercase tracking-wide text-muted">
              Desde
            </p>
            <p className="text-sm font-semibold">$ 49.900</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
