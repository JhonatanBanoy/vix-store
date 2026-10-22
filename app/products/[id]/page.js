import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Truck, ShieldCheck, RotateCcw } from "lucide-react";

import Container from "../../../components/layout/Container";
import Badge from "../../../components/ui/Badge";
import AddToCartButton from "../../../components/product/AddToCartButton";
import { fetchProductById } from "../../../lib/products";
import { formatPrice, discountPercent } from "../../../lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) notFound();

  const discount = discountPercent(product.compareAtPrice, product.price);
  const outOfStock = product.stock <= 0;

  return (
    <Container className="py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a productos
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Imagen */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-bone">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <span className="flex h-full items-center justify-center text-sm text-muted">
              Sin imagen
            </span>
          )}

          {discount > 0 && (
            <Badge variant="sale" className="absolute left-4 top-4">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Información */}
        <div className="flex flex-col">
          {outOfStock && (
            <Badge variant="danger" className="mb-3 self-start">
              Agotado
            </Badge>
          )}

          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

          <p className="mt-4 text-sm">
            <span className="text-muted">Disponibilidad: </span>
            <span
              className={
                outOfStock ? "font-semibold text-danger" : "font-semibold text-success"
              }
            >
              {outOfStock ? "Sin stock" : `${product.stock} unidades`}
            </span>
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton product={product} className="flex-1" />
            <AddToCartButton
              product={product}
              goToCart
              className="flex-1 bg-ink hover:bg-ink/90"
            >
              Comprar ahora
            </AddToCartButton>
          </div>

          {/* Beneficios */}
          <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
            <li className="flex items-center gap-3 text-muted">
              <Truck className="h-4 w-4 text-brand" /> Envío a todo el país
            </li>
            <li className="flex items-center gap-3 text-muted">
              <ShieldCheck className="h-4 w-4 text-brand" /> Pago 100% seguro
            </li>
            <li className="flex items-center gap-3 text-muted">
              <RotateCcw className="h-4 w-4 text-brand" /> Devoluciones hasta 30 días
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
