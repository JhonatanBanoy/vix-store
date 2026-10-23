"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Eye,
  EyeOff,
  AlertTriangle,
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";

import Container from "../layout/Container";
import Button from "../ui/Button";
import Toast from "../ui/Toast";
import ProductModal from "./ProductModal";
import { api } from "../../lib/api";
import { cn, formatPrice } from "../../lib/utils";
import { categoryLabel } from "../../lib/categories";

const PAGE_SIZE = 8;

const isVisible = (p) => p.isActive !== false;

function StatusSwitch({ checked, onChange, loading }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Ocultar producto" : "Mostrar producto"}
      disabled={loading}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-brand" : "bg-line",
        loading && "opacity-60"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function StatCard({ icon: Icon, label, value, tone = "default" }) {
  const tones = {
    default: "bg-brand-soft text-brand",
    success: "bg-success/10 text-success",
    muted: "bg-bone text-muted",
    danger: "bg-danger/10 text-danger",
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-4">
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          tones[tone] || tones.default
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xl font-bold leading-none">{value}</p>
        <p className="mt-1 text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState({ open: false, product: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => setToast({ type, message });

  const handleAuthError = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("vix:auth"));
    router.replace("/login?expired=1");
  };

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get("/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthError();
        return;
      }
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, filter]);

  const counts = useMemo(() => {
    const visible = products.filter(isVisible).length;
    return {
      total: products.length,
      visible,
      hidden: products.length - visible,
      outOfStock: products.filter((p) => Number(p.stock) <= 0).length,
    };
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return products.filter((p) => {
      const matchesQuery =
        !q ||
        `${p.name || ""} ${p.description || ""}`.toLowerCase().includes(q);

      const matchesFilter =
        filter === "all" ||
        (filter === "visible" ? isVisible(p) : !isVisible(p));

      return matchesQuery && matchesFilter;
    });
  }, [products, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSave = async (values) => {
    const token = localStorage.getItem("token");
    if (!token) return handleAuthError();

    setSaving(true);

    try {
      if (modal.product?._id) {
        await api.put(`/products/${modal.product._id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("success", "Producto actualizado correctamente");
      } else {
        await api.post("/products", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("success", "Producto agregado correctamente");
      }

      setModal({ open: false, product: null });
      await load();
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        handleAuthError();
        return;
      }

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "No se pudo guardar el producto";

      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (product, checked) => {
    const token = localStorage.getItem("token");
    if (!token) return handleAuthError();

    setTogglingId(product._id);

    setProducts((prev) =>
      prev.map((p) =>
        p._id === product._id ? { ...p, isActive: checked } : p
      )
    );

    try {
      await api.put(
        `/products/${product._id}`,
        { isActive: checked },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast(
        "success",
        checked
          ? `"${product.name}" ya es visible en la tienda`
          : `"${product.name}" se ocultó de la tienda`
      );
    } catch (err) {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, isActive: !checked } : p
        )
      );

      if (err?.response?.status === 401 || err?.response?.status === 403) {
        handleAuthError();
        return;
      }

      showToast("error", "No se pudo actualizar la disponibilidad");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;

    const token = localStorage.getItem("token");
    if (!token) return handleAuthError();

    setDeleteBusy(true);

    try {
      await api.delete(`/products/${deleting._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("success", "Producto eliminado");
      setDeleting(null);
      await load();
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        handleAuthError();
        return;
      }
      showToast("error", "No se pudo eliminar el producto");
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <Container className="py-8">
      <Toast
        open={Boolean(toast)}
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />

      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Administración
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Productos</h1>
          <p className="mt-1 text-sm text-muted">
            Gestiona el catálogo y la disponibilidad de la tienda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-paper px-4 text-sm font-medium text-ink transition-colors hover:bg-bone"
          >
            <Store className="h-4 w-4" /> Ver tienda
          </a>
          <Button onClick={() => setModal({ open: true, product: null })}>
            <Plus className="h-4 w-4" /> Agregar producto
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Productos" value={counts.total} />
        <StatCard
          icon={Eye}
          label="Visibles"
          value={counts.visible}
          tone="success"
        />
        <StatCard
          icon={EyeOff}
          label="Ocultos"
          value={counts.hidden}
          tone="muted"
        />
        <StatCard
          icon={AlertTriangle}
          label="Sin stock"
          value={counts.outOfStock}
          tone="danger"
        />
      </div>

      {/* Panel */}
      <div className="mt-6 rounded-2xl border border-line bg-paper">
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="h-10 w-full rounded-xl border border-line bg-bone/60 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:bg-paper focus:ring-2 focus:ring-brand/15"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-line p-1">
              {[
                { key: "all", label: "Todos" },
                { key: "visible", label: "Visibles" },
                { key: "hidden", label: "Ocultos" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter(tab.key)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    filter === tab.key
                      ? "bg-ink text-white"
                      : "text-muted hover:text-ink"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={load}
              aria-label="Recargar"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-muted transition-colors hover:bg-bone hover:text-ink"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl bg-bone"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <p className="text-sm text-danger">{error}</p>
            <Button variant="outline" onClick={load}>
              Reintentar
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-display text-lg font-bold">
              {products.length === 0
                ? "Todavía no hay productos"
                : "No encontramos coincidencias"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {products.length === 0
                ? "Agrega tu primer producto para comenzar."
                : "Prueba con otra búsqueda o cambia el filtro."}
            </p>
          </div>
        ) : (
          <>
            {/* Tabla escritorio */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                    <th className="px-4 py-3 font-medium">Producto</th>
                    <th className="px-4 py-3 font-medium">Precio</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Disponible</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((product) => {
                    const visible = isVisible(product);
                    const stock = Number(product.stock) || 0;

                    return (
                      <tr
                        key={product._id}
                        className={cn(
                          "border-b border-line transition-colors last:border-0 hover:bg-bone/40",
                          !visible && "opacity-60"
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-line bg-bone">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {product.name}
                              </p>
                              <p className="mt-0.5 max-w-[260px] truncate text-xs text-muted">
                                {product.description}
                              </p>
                              {categoryLabel(product.category) && (
                                <span className="mt-1 inline-flex rounded-md bg-bone px-1.5 py-0.5 text-[10px] font-medium text-muted">
                                  {categoryLabel(product.category)}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-semibold">
                          {formatPrice(product.price)}
                        </td>

                        <td className="px-4 py-3">
                          {stock > 0 ? (
                            <span className="font-medium">{stock}</span>
                          ) : (
                            <span className="inline-flex rounded-full bg-danger/10 px-2 py-0.5 text-xs font-semibold text-danger">
                              Sin stock
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <StatusSwitch
                            checked={visible}
                            loading={togglingId === product._id}
                            onChange={(next) => handleToggle(product, next)}
                          />
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setModal({ open: true, product })
                              }
                              aria-label={`Editar ${product.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-bone hover:text-ink"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleting(product)}
                              aria-label={`Eliminar ${product.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-danger/5 hover:text-danger"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Tarjetas móvil */}
            <div className="divide-y divide-line md:hidden">
              {rows.map((product) => {
                const visible = isVisible(product);
                const stock = Number(product.stock) || 0;

                return (
                  <div
                    key={product._id}
                    className={cn("p-4", !visible && "opacity-60")}
                  >
                    <div className="flex gap-3">
                      <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-bone">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-snug">
                          {product.name}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                          {product.description}
                        </p>
                        {categoryLabel(product.category) && (
                          <span className="mt-1 inline-flex rounded-md bg-bone px-1.5 py-0.5 text-[10px] font-medium text-muted">
                            {categoryLabel(product.category)}
                          </span>
                        )}
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {formatPrice(product.price)}
                          </span>
                          {stock > 0 ? (
                            <span className="text-xs text-muted">
                              · {stock} en stock
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-danger">
                              · Sin stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusSwitch
                          checked={visible}
                          loading={togglingId === product._id}
                          onChange={(next) => handleToggle(product, next)}
                        />
                        <span className="text-xs text-muted">
                          {visible ? "Visible" : "Oculto"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setModal({ open: true, product })}
                          aria-label={`Editar ${product.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-bone hover:text-ink"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(product)}
                          aria-label={`Eliminar ${product.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-danger/5 hover:text-danger"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginación */}
            <div className="flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted">
                Mostrando {rows.length} de {filtered.length} productos
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:bg-bone disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPage(n)}
                        className={cn(
                          "flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-xs font-medium transition-colors",
                          n === currentPage
                            ? "border-brand bg-brand text-white"
                            : "border-line text-muted hover:bg-bone"
                        )}
                      >
                        {n}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    aria-label="Página siguiente"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:bg-bone disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal crear / editar */}
      <ProductModal
        open={modal.open}
        product={modal.product}
        saving={saving}
        onClose={() => !saving && setModal({ open: false, product: null })}
        onSave={handleSave}
      />

      {/* Confirmar eliminación */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div
            className="absolute inset-0"
            onClick={() => !deleteBusy && setDeleting(null)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm rounded-2xl border border-line bg-paper p-5 shadow-2xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <Trash2 className="h-5 w-5" />
            </div>

            <h2 className="mt-4 font-display text-lg font-bold">
              Eliminar producto
            </h2>
            <p className="mt-1 text-sm text-muted">
              ¿Seguro que quieres eliminar{" "}
              <span className="font-semibold text-ink">{deleting.name}</span>?
              Esta acción no se puede deshacer.
            </p>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleting(null)}
                disabled={deleteBusy}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleteBusy}
              >
                {deleteBusy ? "Eliminando..." : "Sí, eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
