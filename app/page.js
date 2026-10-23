import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Container from "../components/layout/Container";
import Hero from "../components/home/Hero";
import TrustBar from "../components/home/TrustBar";
import CategoryGrid from "../components/home/CategoryGrid";
import PromoBanner from "../components/home/PromoBanner";
import EmptyState from "../components/home/EmptyState";
import RecentlyViewed from "../components/home/RecentlyViewed";
import ProductGrid from "../components/product/ProductGrid";
import ProductRail from "../components/product/ProductRail";
import { fetchProducts } from "../lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inicio",
  description:
    "Compra tecnología, moda y hogar en Vix. Envíos seguros a todo el país.",
};

export default async function HomePage() {
  const products = await fetchProducts();
  const active = products.filter((product) => product.isActive);
  // El riel muestra 4 a la vez; se envían 8 para que tenga recorrido.
  const featured = active.slice(0, 8);

  const featuredIds = new Set(featured.map((product) => product.id));
  const newArrivals = [...active]
    .filter((product) => !featuredIds.has(product.id))
    .sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 4);

  return (
    <>
      <Hero products={active} />
      <TrustBar />
      <CategoryGrid />

      <section className="pb-4">
        <Container>
          {featured.length ? (
            <ProductRail
              products={featured}
              title="Destacados"
              eyebrow="Selección Vix"
              description="Una selección pensada para ti."
              compact
            />
          ) : (
            <>
              <h2 className="text-2xl font-bold sm:text-3xl">Destacados</h2>
              <div className="mt-6">
                <EmptyState />
              </div>
            </>
          )}
        </Container>
      </section>

      {newArrivals.length > 0 && (
        <section className="pt-10">
          <Container>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                  Lo último
                </p>
                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Nuevos ingresos
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Lo último que llegó a la tienda.
                </p>
              </div>
              <Link
                href="/products"
                className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand hover:underline"
              >
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6">
              <ProductGrid
                products={newArrivals}
                className="sm:grid-cols-2 lg:grid-cols-4"
                compact
              />
            </div>
          </Container>
        </section>
      )}

      <RecentlyViewed products={active} />

      <PromoBanner />
    </>
  );
}
