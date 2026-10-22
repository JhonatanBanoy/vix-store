import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Container from "../components/layout/Container";
import Hero from "../components/home/Hero";
import TrustBar from "../components/home/TrustBar";
import CategoryGrid from "../components/home/CategoryGrid";
import PromoBanner from "../components/home/PromoBanner";
import EmptyState from "../components/home/EmptyState";
import ProductGrid from "../components/product/ProductGrid";
import ProductGridSkeleton from "../components/product/ProductGridSkeleton";
import { fetchProducts } from "../lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inicio",
  description:
    "Compra tecnología, moda y hogar en Vix. Envíos seguros a todo el país.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryGrid />

      <section className="pb-4">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Destacados</h2>
              <p className="mt-1 text-sm text-muted">
                Una selección de lo más visto de la semana.
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
            <Suspense fallback={<ProductGridSkeleton count={8} />}>
              <FeaturedProducts />
            </Suspense>
          </div>
        </Container>
      </section>

      <PromoBanner />
    </>
  );
}

async function FeaturedProducts() {
  const products = await fetchProducts();
  const featured = products.filter((p) => p.isActive).slice(0, 8);

  if (!featured.length) return <EmptyState />;

  return <ProductGrid products={featured} />;
}
