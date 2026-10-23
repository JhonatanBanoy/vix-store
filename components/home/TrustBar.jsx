import { Truck, MessageCircle, RotateCcw, Star } from "lucide-react";

import Container from "../layout/Container";

const items = [
  { icon: Truck, title: "Envío a todo el país", text: "Rápido y seguro" },
  { icon: MessageCircle, title: "Compra directa", text: "Por WhatsApp" },
  { icon: RotateCcw, title: "Devoluciones", text: "Hasta 30 días" },
  { icon: Star, title: "Calidad garantizada", text: "Productos verificados" },
];

export default function TrustBar() {
  return (
    <div className="border-b border-line bg-paper">
      <Container className="grid grid-cols-2 gap-4 py-6 sm:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{title}</p>
              <p className="truncate text-xs text-muted">{text}</p>
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
