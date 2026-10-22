"use client";

import { useState } from "react";
import { Send, CheckCircle2, MessageCircle } from "lucide-react";

import Input from "../ui/Input";
import Button from "../ui/Button";
import { whatsappLink } from "../../lib/contact";

const EMPTY = { name: "", email: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [opened, setOpened] = useState(false);
  const [lastLink, setLastLink] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const text = [
      "Hola Vix 👋",
      "",
      `Nombre: ${form.name}`,
      `Correo: ${form.email}`,
      "",
      form.message,
    ].join("\n");

    const link = whatsappLink(text);
    setLastLink(link);
    setOpened(true);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const reset = () => {
    setForm(EMPTY);
    setOpened(false);
    setLastLink("");
  };

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      {opened && (
        <div className="mb-6 rounded-xl border border-success/30 bg-success/5 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <div className="text-sm">
              <p className="font-semibold text-ink">
                Abrimos WhatsApp con tu mensaje
              </p>
              <p className="mt-1 text-muted">
                Si no se abrió automáticamente,{" "}
                <a
                  href={lastLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand hover:underline"
                >
                  haz clic aquí
                </a>
                .
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-2 text-xs font-semibold text-brand hover:underline"
              >
                Escribir otro mensaje
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Nombre
          </label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Correo
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tucorreo@ejemplo.com"
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <label htmlFor="message" className="text-sm font-medium">
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Cuéntanos en qué podemos ayudarte"
            required
            rows={5}
            className="mt-1.5 w-full resize-y rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition-colors duration-200 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <Send className="h-4 w-4" /> Abrir WhatsApp
        </Button>

        <p className="flex items-center gap-1.5 text-xs text-muted">
          <MessageCircle className="h-3.5 w-3.5" />
          No guardamos tus datos. El mensaje se envía desde tu propio WhatsApp.
        </p>
      </form>
    </div>
  );
}
