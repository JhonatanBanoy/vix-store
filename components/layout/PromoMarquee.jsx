import Link from "next/link";
import { Sparkles } from "lucide-react";

const MESSAGES = [
  "Nuevos ingresos",
  "Compra ahora",
  "Compra directa por WhatsApp",
  "Selección Vix",
];

function MarqueeGroup() {
  return (
    <div className="flex shrink-0 items-center">
      {MESSAGES.map((message) => (
        <span
          key={message}
          className="flex items-center gap-3 whitespace-nowrap pr-8 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90 transition-colors group-hover:text-white sm:text-[11px]"
        >
          {message}
          <Sparkles
            className="h-2.5 w-2.5 shrink-0 text-deal"
            aria-hidden="true"
          />
        </span>
      ))}
    </div>
  );
}

export default function PromoMarquee() {
  return (
    <Link
      href="/products"
      aria-label="Ver todos los productos"
      className="vix-marquee group relative block overflow-hidden border-b border-white/15 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
    >
      <span
        aria-hidden="true"
        className="vix-marquee-glow pointer-events-none absolute inset-0"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />

      <div className="vix-marquee-mask relative z-10 overflow-hidden">
        <div
          className="vix-marquee-track flex w-max items-center py-3"
          aria-hidden="true"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <MarqueeGroup key={index} />
          ))}
        </div>
      </div>
    </Link>
  );
}
