"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import Container from "../../../components/layout/Container";
import Button from "../../../components/ui/Button";
import { api } from "../../../lib/api";
import { cn, formatPrice } from "../../../lib/utils";

const STATUS = {
  pending_payment: {
    label: "Pago pendiente",
    className: "bg-deal/20 text-ink",
    icon: Clock3,
  },
  processing: {
    label: "En proceso",
    className: "bg-brand-soft text-brand",
    icon: Package,
  },
  paid: {
    label: "Pagado",
    className: "bg-success/10 text-success",
    icon: CheckCircle2,
  },
  shipped: {
    label: "Enviado",
    className: "bg-brand-soft text-brand",
    icon: Truck,
  },
  delivered: {
    label: "Entregado",
    className: "bg-success/10 text-success",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-danger/10 text-danger",
    icon: XCircle,
  },
};

const PAYMENT = {
  wompi: "Wompi",
  cod: "Contra entrega",
  mercadopago: "Mercado Pago",
  paypal: "PayPal",
};

const PAYMENT_STATUS = {
  pending: "Pendiente",
  approved: "Aprobado",
  declined: "Rechazado",
  voided: "Anulado",
  error: "Con error",
  not_required: "No aplica",
};

const FILTERS = [
  { key: "all", label: "Todos" },
  { key: "pending", label: "Pendientes" },
  { key: "processing", label: "En proceso" },
  { key: "shipped", label: "Enviados" },
  { key: "delivered", label: "Entregados" },
  { key: "cancelled", label: "Cancelados" },
];

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

function StatusBadge({ status }) {
  const meta = STATUS[status] || STATUS.processing;
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        meta.className
      )}
    >
      <Icon className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.replace("/login");
      return;
    }
    if (role !== "admin") {
      router.replace("/");
      return;
    }
    setIsAdmin(true);
  }, [router]);

  const load = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/orders/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No pudimos cargar los pedidos. Revisa la conexión."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "pending" && order.status === "pending_payment") ||
        order.status === filter;
      if (!matchesFilter) return false;
      if (!term) return true;

      return [
        order.reference,
        order.customer?.name,
        order.customer?.email,
        order.customer?.phone,
        order.shippingAddress?.city,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [orders, query, filter]);

  const counts = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending_payment").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
    };
  }, [orders]);

  const updateStatus = async (order, status) => {
    if (!status || status === order.status) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setUpdating(order.id);
    setNotice("");

    try {
      const { data } = await api.patch(
        `/orders/${order.id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((item) => (item.id === order.id ? data.order : item))
      );
      setNotice(`Pedido ${order.reference} actualizado.`);
    } catch (err) {
      setNotice(
        err.response?.data?.message ||
          "No se pudo actualizar el estado del pedido."
      );
    } finally {
      setUpdating("");
    }
  };

  if (!isAdmin) {
    return (
      <Container className="py-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-bone" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-bone" />
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-bone" />
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Volver a productos
          </Link>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <ShoppingBag className="h-6 w-6 text-brand" /> Pedidos
          </h1>
          <p className="mt-1 text-sm text-muted">
            Revisa los pedidos de la tienda y actualiza su estado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-paper px-4 text-sm font-medium text-ink transition-colors hover:bg-bone"
          >
            Ver tienda
          </a>
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pedidos", value: counts.total },
          { label: "Pago pendiente", value: counts.pending },
          { label: "En proceso", value: counts.processing },
          { label: "Enviados", value: counts.shipped },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-line bg-paper p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {item.label}
            </p>
            <p className="mt-1 font-display text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-paper">
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por pedido, cliente o ciudad..."
              className="h-10 w-full rounded-xl border border-line bg-bone/60 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:bg-paper focus:ring-2 focus:ring-brand/15"
            />
          </div>

          <div className="flex flex-wrap gap-1 rounded-xl border border-line p-1">
            {FILTERS.map((tab) => (
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
        </div>

        {notice ? (
          <p className="border-b border-line bg-bone/60 px-4 py-2.5 text-xs text-muted">
            {notice}
          </p>
        ) : null}

        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-bone" />
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
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bone text-muted">
              <ShoppingBag className="h-6 w-6" />
            </span>
            <p className="mt-3 font-display text-lg font-bold">
              {orders.length === 0
                ? "Todavía no hay pedidos"
                : "No encontramos coincidencias"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {orders.length === 0
                ? "Cuando alguien compre, el pedido aparecerá aquí."
                : "Prueba con otra búsqueda o cambia el filtro."}
            </p>
          </div>
        ) : (
          <>
            {/* Tabla escritorio */}
            <div className="hidden lg:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                    <th className="px-4 py-3 font-medium">Pedido</th>
                    <th className="px-4 py-3 font-medium">Cliente</th>
                    <th className="px-4 py-3 font-medium">Productos</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Pago</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((order) => (
                    <tr key={order.id} className="align-top">
                      <td className="px-4 py-4">
                        <p className="font-mono text-xs font-semibold">
                          {order.reference}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {formatDate(order.createdAt)}
                        </p>
                        <div className="mt-2">
                          <StatusBadge status={order.status} />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{order.customer?.name}</p>
                        <p className="text-xs text-muted">
                          {order.customer?.phone}
                        </p>
                        <p className="max-w-[190px] truncate text-xs text-muted">
                          {order.customer?.email}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.department}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <ul className="space-y-0.5 text-xs text-muted">
                          {(order.items || []).map((item) => (
                            <li key={`${item.productId}-${item.name}`}>
                              {item.name} × {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-xs text-muted">
                          Envío {formatPrice(order.shipping)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs font-medium">
                          {PAYMENT[order.paymentMethod] ||
                            order.paymentMethod}
                        </p>
                        <p className="text-xs text-muted">
                          {PAYMENT_STATUS[order.paymentStatus] ||
                            order.paymentStatus}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order, e.target.value)
                          }
                          disabled={updating === order.id}
                          className="h-9 rounded-lg border border-line bg-paper px-2 text-xs font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:opacity-60"
                        >
                          <option value="pending_payment" disabled>
                            Pago pendiente
                          </option>
                          <option value="processing">En proceso</option>
                          <option value="paid">Pagado</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tarjetas móvil */}
            <div className="divide-y divide-line lg:hidden">
              {filtered.map((order) => (
                <div key={order.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs font-semibold">
                        {order.reference}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="font-medium">{order.customer?.name}</p>
                      <p className="text-xs text-muted">
                        {order.customer?.phone}
                      </p>
                      <p className="break-all text-xs text-muted">
                        {order.customer?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">
                        {order.shippingAddress?.address}
                      </p>
                      <p className="text-xs text-muted">
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.department}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1 rounded-xl bg-bone/60 p-3 text-xs text-muted">
                    {(order.items || []).map((item) => (
                      <li
                        key={`${item.productId}-${item.name}`}
                        className="flex justify-between gap-2"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <div>
                      <p className="font-semibold">{formatPrice(order.total)}</p>
                      <p className="text-xs text-muted">
                        {PAYMENT[order.paymentMethod] ||
                          order.paymentMethod}{" "}
                        ·{" "}
                        {PAYMENT_STATUS[order.paymentStatus] ||
                          order.paymentStatus}
                      </p>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order, e.target.value)}
                      disabled={updating === order.id}
                      className="h-9 rounded-lg border border-line bg-paper px-2 text-xs font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:opacity-60"
                    >
                      <option value="pending_payment" disabled>
                        Pago pendiente
                      </option>
                      <option value="processing">En proceso</option>
                      <option value="paid">Pagado</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
