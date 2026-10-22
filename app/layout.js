import React from "react";
import { Inter, Space_Grotesk } from "next/font/google";

import Navbar from "./components/Navbar";
import { CartProvider } from "../context/CartContext";

// Estilos globales (Tailwind + tokens de Vix)
import "./globals.css";

// Bootstrap se mantiene temporalmente mientras se migran las páginas antiguas.
// Se eliminará en la fase de limpieza visual.
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Vix — Tienda online",
    template: "%s | Vix",
  },
  description:
    "Vix: tecnología, moda y estilo de vida. Productos seleccionados con envío seguro.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        <CartProvider>
          <header>
            <Navbar />
          </header>

          <main className="mainContent">{children}</main>

          <footer>
            <p>© {new Date().getFullYear()} Vix — Todos los derechos reservados</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
