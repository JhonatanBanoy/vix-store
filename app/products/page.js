import Container from "../../components/layout/Container";
import Breadcrumbs from "../../components/catalog/Breadcrumbs";
import CatalogToolbar from "../../components/catalog/CatalogToolbar";
import FilterSidebar from "../../components/catalog/FilterSidebar";
import Pagination from "../../components/catalog/Pagination";
import ProductGrid from "../../components/product/ProductGrid";
import EmptyState from "../../components/home/EmptyState";
import { fetchProducts } from "../../lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Productos",
  description: "Explora el catálogo completo de Vix.",
};

const PAGE_SIZE = 12;

export default async function ProductsPage({ searchParams }) {
  const sp = (await searchParams) || {};

  const search = String(sp.search || "").trim().toLowerCase();
  const category = String(sp.category || "").trim().toLowerCase();
  const min = sp.min !== undefined ? Number(sp.min) : null;
  const max = sp.max !== undefined ? Number(sp.max) : null;
  const available = sp.available === "1";
  const offers = sp.offers === "1";
  const sort = String(sp.sort || "relevance");
  const page = Math.max(1, Number(sp.page) || 1);

  const all = (await fetchProducts()).filter((p) => p.isActive);

  let items = all;

  if (search) {
    items = items.filter((p) =>
      `${p.name} ${p.description}`.toLowerCase().includes(search)
    );
  }

  if (category) {
    items = items.filter(
      (p) =>
        (p.category && String(p.category).toLowerCase() === category) ||
        p.name.toLowerCase().includes(category) ||
        p.description.toLowerCase().includes(category)
    );
  }

  if (min !== null && Number.isFinite(min)) {
    items = items.filter((p) => p.price >= min);
  }

  if (max !== null && Number.isFinite(max)) {
    items = items.filter((p) => p.price <= max);
  }

  if (available) items = items.filter((p) => p.stock > 0);

  if (offers) {
    items = items.filter(
      (p) => p.compareAtPrice && p.compareAtPrice > p.price
    );
  }

  if (sort === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
  if (sort === "name")
    items = [...items].sort((a, b) => a.name.localeCompare(b.name, "es"));
  if (sort === "newest") {
    items = [...items].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = items.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasFilters =
    Boolean(search) ||
    Boolean(category) ||
    min !== null ||
    max !== null ||
    available ||
    offers;

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[{ label: "Inicio", href: "/" }, { label: "Productos" }]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-bold sm:text-3xl">Productos</h1>
        {search && (
          <p className="mt-1 text-sm text-muted">
            Resultados para <span className="font-medium text-ink">“{search}”</span>
          </p>
        )}
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
        <FilterSidebar />

        <div>
          <CatalogToolbar total={total} />

          <div className="mt-5">
            {total > 0 ? (
              <ProductGrid products={pageItems} />
            ) : (
              <EmptyState
                title="No encontramos productos"
                description={
                  hasFilters
                    ? "Prueba quitando algunos filtros o buscando otra cosa."
                    : "Estamos preparando el catálogo. Vuelve pronto."
                }
                actionLabel="Ver todo el catálogo"
                actionHref="/products"
              />
            )}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            searchParams={sp}
          />
        </div>
      </div>
    </Container>
  );
}
