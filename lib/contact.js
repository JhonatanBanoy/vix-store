/**
 * Datos de contacto de Vix.
 * ⚠️ Reemplaza estos valores por los reales cuando los tengas.
 */
export const CONTACT = {
  // Número en formato internacional, sin "+", sin espacios ni guiones.
  whatsappNumber: "573000000000",
  whatsappDisplay: "+57 300 000 0000",
  email: "hola@vix.store",
  hours: "Lunes a sábado · 8:00 a 18:00",
  responseTime: "Respondemos en menos de 24 horas",
};

/** Genera un enlace de WhatsApp con un mensaje opcional ya escrito. */
export function whatsappLink(message = "") {
  const base = `https://wa.me/${CONTACT.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
