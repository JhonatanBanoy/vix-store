import { MessageCircle } from "lucide-react";

import { whatsappLink } from "../../lib/contact";

const MESSAGE =
  "Hola Vix 👋 Necesito ayuda con un pedido o quiero información de un producto.";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Asesoría por WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-ink/20 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20 motion-reduce:animate-none"
      />

      <MessageCircle className="relative h-6 w-6" />

      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 sm:block">
        ¿Te ayudamos?
      </span>
    </a>
  );
}
