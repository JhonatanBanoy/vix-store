import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-1.5 text-sm">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted" />}
          {item.href ? (
            <Link href={item.href} className="text-muted transition-colors hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
