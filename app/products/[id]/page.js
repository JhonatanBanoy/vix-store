import Link from "next/link";
import { notFound } from "next/navigation";
import { Truck, MessageCircle, RotateCcw, ArrowLeft } from "lucide-react";

import Container from "../../../components/layout/Container";
import Badge from "../../../components/ui/Badge";
import Breadcrumbs from "../../../components/catalog/Breadcrumbs";
import ProductGallery from "../../../components/product/ProductGallery";
import ProductBuyBox from "../../../components/product/ProductBuyBox";
import ProductGrid from "../../../components/product/ProductGrid";
import TrackRecentlyViewed from "../../../components/product/TrackRecentlyViewed";
import { fetchProductById, fetchProducts } from "../../../lib/products";
import { discountPercent } from "../../../lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  const description =
    product.shortDescription ||
    (product.description ? product.description.slice(0, 155) : "");

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) notFound();

  // Producto desactivado desde el panel de administración
  if (!product.isActive) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg text-center">
          <Badge variant="muted" className="mx-auto">
            No disponible
          </Badge>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Este producto no está disponible
          </h1>

          <p className="mt-3 text-muted">
            Puede que se haya agotado o que ya no esté en catálogo. Explora
            otras opciones mientras tanto.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-7 text-base font-medium text-white transition-colors hover:bg-brand/90"
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
        </div>
      </Container>
    );
  }

  const discount = discountPercent(product.compareAtPrice, product.price);
  const outOfStock = product.stock <= 0;

  // Relacionados: misma categoría si existe; si no, resto del catálogo.
  const all = await fetchProducts();
  let related = all.filter((p) => p.id !== product.id && p.isActive);

  if (product.category) {
    const sameCategory = related.filter((p) => p.category === product.category);
    if (sameCategory.length) related = sameCategory;
  }

  related = related.slice(0, 4);

  return (
    <Container className="py-8">
      <TrackRecentlyViewed productId={product.id} />

      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Productos", href: "/products" },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Galería */}
        <ProductGallery
          images={product.images}
          name={product.name}
          discount={discount}
        />

        {/* Información */}
        <div className="flex flex-col">
          {outOfStock ? (
            <Badge variant="danger" className="mb-3 self-start">
              Agotado
            </Badge>
          ) : discount > 0 ? (
            <Badge variant="sale" className="mb-3 self-start">
              Oferta
            </Badge>
          ) : null}

          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            {product.name}
          </h1>

          {product.shortDescription && (
            <p className="mt-3 leading-relaxed text-muted">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-6">
            <ProductBuyBox product={product} />
          </div>

          {/* Beneficios */}
          <ul className="mt-6 space-y-3 rounded-2xl border border-line bg-bone/60 p-5 text-sm">
            <li className="flex items-center gap-3 text-muted">
              <Truck className="h-4 w-4 shrink-0 text-brand" /> Envío a todo el
              país
            </li>
            <li className="flex items-center gap-3 text-muted">
              <MessageCircle className="h-4 w-4 shrink-0 text-brand" /> Compra
              asistida por WhatsApp
            </li>
            <li className="flex items-center gap-3 text-muted">
              <RotateCcw className="h-4 w-4 shrink-0 text-brand" /> Devoluciones
              hasta 30 días
            </li>
          </ul>
        </div>
      </div>

      {/* Descripción */}
      {product.description && (
        <section className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-xl font-bold">Descripción</h2>
          <p className="mt-4 max-w-3xl whitespace-pre-line leading-relaxed text-muted">
            {product.description}
          </p>
        </section>
      )}

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="mt-14 border-t border-line pt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-bold">
              También te puede interesar
            </h2>
            <Link
              href="/products"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Ver todo
            </Link>
          </div>

          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}

      <div className="mt-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a productos
        </Link>
      </div>
    </Container>
  );
}
