import Link from "next/link";

import Container from "./Container";

const categories = [
  { label: "Todo", href: "/products" },
  { label: "Audífonos", href: "/products?category=audifonos" },
  { label: "Tecnología", href: "/products?category=tecnologia" },
  { label: "Moda hombre", href: "/products?category=moda-hombre" },
  { label: "Moda mujer", href: "/products?category=moda-mujer" },
  { label: "Hogar", href: "/products?category=hogar" },
  { label: "Ofertas", href: "/products?offers=1" },
];

export default function CategoryNav() {
  return (
    <div className="border-b border-line bg-paper">
      <Container>
        <nav
          aria-label="Categorías"
          className="flex items-center gap-6 overflow-x-auto py-2.5 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="whitespace-nowrap text-muted transition-colors hover:text-ink"
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </Container>
    </div>
  );
}
