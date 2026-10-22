import React from "react";
import { Inter, Space_Grotesk } from "next/font/google";

import { CartProvider } from "../context/CartContext";
import TopBar from "../components/layout/TopBar";
import Header from "../components/layout/Header";
import CategoryNav from "../components/layout/CategoryNav";
import Footer from "../components/layout/Footer";

// Estilos globales (Tailwind + tokens de Vix)
import "./globals.css";

// Bootstrap se mantiene temporalmente mientras se migran las páginas antiguas.
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
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper text-ink">
        <CartProvider>
          <TopBar />
          <Header />
          <CategoryNav />

          <main className="flex-1">{children}</main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
