import Link from "next/link";
import { PackageSearch } from "lucide-react";

import Button from "../ui/Button";

export default function EmptyState({
  title = "Todavía no hay productos",
  description = "Estamos preparando el catálogo. Vuelve pronto para ver las novedades.",
  actionLabel = "Ver catálogo",
  actionHref = "/products",
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-bone/50 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper text-muted shadow-sm">
        <PackageSearch className="h-7 w-7" />
      </span>
      <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      <Link href={actionHref} className="mt-6">
        <Button variant="outline">{actionLabel}</Button>
      </Link>
    </div>
  );
}
