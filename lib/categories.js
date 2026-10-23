/**
 * Categorías del catálogo.
 * El slug es lo que se guarda en MongoDB y se usa en /products?category=slug
 */
export const CATEGORIES = [
  { slug: "audifonos", label: "Audífonos" },
  { slug: "tecnologia", label: "Tecnología" },
  { slug: "moda-hombre", label: "Moda hombre" },
  { slug: "moda-mujer", label: "Moda mujer" },
  { slug: "hogar", label: "Hogar" },
  { slug: "calzado", label: "Calzado" },
];

export function categoryLabel(slug) {
  return CATEGORIES.find((category) => category.slug === slug)?.label || "";
}
