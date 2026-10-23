import {
  MessageCircle,
  Mail,
  Clock,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";

import Container from "../../components/layout/Container";
import ContactForm from "../../components/contact/ContactForm";
import { CONTACT, whatsappLink } from "../../lib/contact";

export const metadata = {
  title: "Contacto",
  description:
    "Escríbenos por WhatsApp o correo. En Vix respondemos en menos de 24 horas.",
};

const FAQS = [
  {
    q: "¿Cuánto tarda el envío?",
    a: "Preparamos tu pedido en 24–48 horas. El tiempo de entrega depende de tu ciudad; te compartimos el seguimiento por WhatsApp.",
  },
  {
    q: "¿Puedo cambiar o devolver un producto?",
    a: "Sí. Tienes hasta 30 días para solicitar un cambio o devolución, siempre que el producto esté en buen estado.",
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: "Puedes pagar contra entrega. También estamos activando Wompi para pagar en línea con tarjetas, PSE y Nequi.",
  },
  {
    q: "¿Hacen envíos a todo el país?",
    a: "Sí, enviamos a todo el territorio nacional. El costo se calcula según tu ubicación.",
  },
];

export default function ContactPage() {
  const whatsappMessage = "Hola Vix, quiero hacer una consulta.";

  return (
    <>
      {/* Encabezado */}
      <section className="border-b border-line bg-bone">
        <Container className="py-14 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Contacto
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
            Estamos aquí para ayudarte
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            ¿Dudas con un pedido, un producto o un envío? Escríbenos y te
            respondemos lo antes posible. {CONTACT.responseTime.toLowerCase()}.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        {/* Tarjetas de contacto */}
        <div className="grid gap-4 sm:grid-cols-3">
          <a
            href={whatsappLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl bg-brand p-6 text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            <MessageCircle className="h-6 w-6" />
            <h2 className="mt-4 font-display text-lg font-bold">WhatsApp</h2>
            <p className="mt-1 text-sm text-white/80">
              {CONTACT.whatsappDisplay}
            </p>
            <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold">
              Escribir ahora
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>

          <a
            href={`mailto:${CONTACT.email}`}
            className="group flex flex-col rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-ink/20 hover:bg-bone/60"
          >
            <Mail className="h-6 w-6 text-brand" />
            <h2 className="mt-4 font-display text-lg font-bold">Correo</h2>
            <p className="mt-1 break-all text-sm text-muted">{CONTACT.email}</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-brand">
              Enviar correo
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>

          <div className="flex flex-col rounded-2xl border border-line bg-paper p-6">
            <Clock className="h-6 w-6 text-brand" />
            <h2 className="mt-4 font-display text-lg font-bold">Horario</h2>
            <p className="mt-1 text-sm text-muted">{CONTACT.hours}</p>
            <p className="mt-auto pt-5 text-xs text-muted">
              Los mensajes fuera de horario se responden al día siguiente.
            </p>
          </div>
        </div>

        {/* Formulario + FAQ */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Envíanos un mensaje
            </h2>
            <p className="mt-2 text-sm text-muted">
              Completa el formulario y se abrirá WhatsApp con tu mensaje listo
              para enviar.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold">
              Preguntas frecuentes
            </h2>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {FAQS.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                    {item.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
