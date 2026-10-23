"use client";

import { useEffect, useState } from "react";
import { X, ImageIcon } from "lucide-react";

import Input from "../ui/Input";
import Button from "../ui/Button";
import { cn } from "../../lib/utils";
import { CATEGORIES } from "../../lib/categories";

const EMPTY = {
  name: "",
  price: "",
  compareAtPrice: "",
  stock: "",
  category: "",
  image: "",
  description: "",
  isActive: true,
};

export default function ProductModal({ open, product, onClose, onSave, saving }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(product?._id);

  useEffect(() => {
    if (!open) return;

    if (product) {
      setForm({
        name: product.name || "",
        price: product.price ?? "",
        compareAtPrice: product.compareAtPrice ?? "",
        stock: product.stock ?? "",
        category: product.category || "",
        image: product.image || "",
        description: product.description || "",
        isActive: product.isActive !== false,
      });
    } else {
      setForm(EMPTY);
    }

    setErrors({});
  }, [open, product, setForm, setErrors]);

  // Cerrar con Escape y bloquear el scroll del fondo
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };

    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, saving, onClose]);

  if (!open) return null;

  const update = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim()) next.name = "El nombre es obligatorio";

    const price = Number(form.price);
    if (form.price === "" || Number.isNaN(price) || price <= 0)
      next.price = "Ingresa un precio mayor a 0";

    const stock = Number(form.stock);
    if (form.stock === "" || Number.isNaN(stock) || stock < 0)
      next.stock = "El stock no puede ser negativo";

    if (form.compareAtPrice !== "") {
      const previous = Number(form.compareAtPrice);
      if (Number.isNaN(previous) || previous <= 0)
        next.compareAtPrice = "Ingresa un precio anterior válido";
      else if (!Number.isNaN(price) && previous <= price)
        next.compareAtPrice = "Debe ser mayor al precio actual";
    }

    if (!form.image.trim()) next.image = "La imagen es obligatoria";
    else if (!/^(\/|https?:\/\/)/i.test(form.image.trim()))
      next.image = "Usa una ruta (/img/foto.jpg) o una URL que empiece por http";
    if (!form.description.trim())
      next.description = "La descripción es obligatoria";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      name: form.name.trim(),
      price: Number(form.price),
      compareAtPrice:
        form.compareAtPrice === "" ? null : Number(form.compareAtPrice),
      stock: Number(form.stock),
      category: form.category,
      image: form.image.trim(),
      description: form.description.trim(),
      isActive: form.isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/50 p-4 sm:items-center">
      <div
        className="absolute inset-0"
        onClick={() => !saving && onClose()}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Editar producto" : "Agregar producto"}
        className="relative my-8 w-full max-w-lg rounded-2xl border border-line bg-paper shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-bold">
            {isEdit ? "Editar producto" : "Agregar producto"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Cerrar"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-bone hover:text-ink disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="p-name" className="text-sm font-medium">
                Nombre
              </label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Ej: Audífonos Vix Pro"
                className="mt-1.5"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-danger">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="p-category" className="text-sm font-medium">
                  Categoría
                </label>
                <select
                  id="p-category"
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                >
                  <option value="">Sin categoría</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="p-stock" className="text-sm font-medium">
                  Stock
                </label>
                <Input
                  id="p-stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) => update("stock", e.target.value)}
                  placeholder="10"
                  className="mt-1.5"
                />
                {errors.stock && (
                  <p className="mt-1 text-xs text-danger">{errors.stock}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="p-price" className="text-sm font-medium">
                  Precio
                </label>
                <Input
                  id="p-price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  placeholder="129900"
                  className="mt-1.5"
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-danger">{errors.price}</p>
                )}
              </div>

              <div>
                <label htmlFor="p-compareAtPrice" className="text-sm font-medium">
                  Precio anterior{" "}
                  <span className="text-xs font-normal text-muted">
                    (opcional)
                  </span>
                </label>
                <Input
                  id="p-compareAtPrice"
                  type="number"
                  min="0"
                  step="1"
                  value={form.compareAtPrice}
                  onChange={(e) => update("compareAtPrice", e.target.value)}
                  placeholder="159900"
                  className="mt-1.5"
                />
                {errors.compareAtPrice ? (
                  <p className="mt-1 text-xs text-danger">
                    {errors.compareAtPrice}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-muted">
                    Déjalo vacío si no está en oferta.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="p-image" className="text-sm font-medium">
                URL de la imagen
              </label>
              <div className="mt-1.5 flex gap-3">
                <Input
                  id="p-image"
                  value={form.image}
                  onChange={(e) => update("image", e.target.value)}
                  placeholder="https://... o /img/producto.jpg"
                />
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-bone">
                  {form.image ? (
                    <img
                      src={form.image}
                      alt="Vista previa"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-muted" />
                  )}
                </div>
              </div>
              {errors.image && (
                <p className="mt-1 text-xs text-danger">{errors.image}</p>
              )}
            </div>

            <div>
              <label htmlFor="p-description" className="text-sm font-medium">
                Descripción
              </label>
              <textarea
                id="p-description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                placeholder="Describe el producto en una o dos frases."
                className="mt-1.5 w-full resize-y rounded-xl border border-line bg-paper px-4 py-3 text-sm placeholder:text-muted/70 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-danger">
                  {errors.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => update("isActive", !form.isActive)}
              className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-3 text-left transition-colors hover:bg-bone/60"
            >
              <span>
                <span className="block text-sm font-medium">
                  Visible en la tienda
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  Si lo desactivas, no aparecerá en el catálogo.
                </span>
              </span>

              <span
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                  form.isActive ? "bg-brand" : "bg-line"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
                    form.isActive ? "translate-x-[22px]" : "translate-x-0.5"
                  )}
                />
              </span>
            </button>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? "Guardando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Agregar producto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
