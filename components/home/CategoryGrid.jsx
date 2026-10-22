import Link from "next/link";
import {
  Headphones,
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Footprints,
} from "lucide-react";

import Container from "../layout/Container";

const categories = [
  {
    label: "Audífonos",
    href: "/products?category=audifonos",
    icon: Headphones,
    className: "bg-brand-soft text-brand",
  },
  {
    label: "Tecnología",
    href: "/products?category=tecnologia",
    icon: Smartphone,
    className: "bg-ink text-white",
  },
  {
    label: "Moda hombre",
    href: "/products?category=moda-hombre",
    icon: Shirt,
    className: "bg-bone text-ink",
  },
  {
    label: "Moda mujer",
    href: "/products?category=moda-mujer",
    icon: Sparkles,
    className: "bg-bone text-ink",
  },
  {
    label: "Hogar",
    href: "/products?category=hogar",
    icon: Home,
    className: "bg-deal/20 text-ink",
  },
  {
    label: "Calzado",
    href: "/products?category=calzado",
    icon: Footprints,
    className: "bg-bone text-ink",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-12">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Explora por categoría
            </h2>
            <p className="mt-1 text-sm text-muted">
              Encuentra rápido lo que necesitas.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden text-sm font-semibold text-brand hover:underline sm:block"
          >
            Ver todo
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
          {categories.map(({ label, href, icon: Icon, className }) => (
            <Link
              key={label}
              href={href}
              className="group flex flex-col items-center gap-3 rounded-card border border-line bg-paper p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 ${className}`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-xs font-medium sm:text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
