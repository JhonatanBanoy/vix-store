"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, ShieldCheck, Truck } from "lucide-react";

import Container from "./Container";
import { cn } from "../../lib/utils";

const MESSAGES = [
  { icon: Truck, text: "Envío gratis a todo el país" },
  { icon: MessageCircle, text: "Atención personal por WhatsApp" },
  { icon: ShieldCheck, text: "Productos seleccionados con garantía" },
];

export default function TopBar() {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);

    const onChange = (event) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);

    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % MESSAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [reducedMotion]);

  return (
    <div className="bg-ink text-white">
      <Container className="flex h-9 items-center justify-between gap-4 text-xs">
        <div className="relative h-full min-w-0 flex-1">
          {MESSAGES.map(({ icon: Icon, text }, index) => (
            <span
              key={text}
              className={cn(
                "absolute inset-0 flex items-center gap-2 transition-all duration-500",
                index === active
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-deal" />
              <span className="min-w-0 truncate text-white/85">{text}</span>
            </span>
          ))}
        </div>

        <nav className="hidden shrink-0 items-center gap-6 text-white/80 sm:flex">
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
