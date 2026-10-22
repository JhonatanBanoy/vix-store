import Link from "next/link";
import { Truck } from "lucide-react";

import Container from "./Container";

export default function TopBar() {
  return (
    <div className="hidden bg-ink text-white sm:block">
      <Container className="flex h-9 items-center justify-between text-xs">
        <p className="flex items-center gap-2 text-white/80">
          <Truck className="h-3.5 w-3.5" />
          Envío a todo el país
        </p>

        <nav className="flex items-center gap-6 text-white/80">
          <Link href="/contact" className="transition-colors hover:text-white">
            Ayuda
          </Link>
          <Link href="/contact" className="transition-colors hover:text-white">
            Contacto
          </Link>
        </nav>
      </Container>
    </div>
  );
}
