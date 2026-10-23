import React from "react";
import { Inter, Space_Grotesk } from "next/font/google";

import { CartProvider } from "../context/CartContext";
import TopBar from "../components/layout/TopBar";
import Header from "../components/layout/Header";
import CategoryNav from "../components/layout/CategoryNav";
import Footer from "../components/layout/Footer";
import WhatsAppButton from "../components/layout/WhatsAppButton";
import CornerNotice from "../components/layout/CornerNotice";
import { getNoticeProducts } from "../lib/notice-products";

// Estilos globales (Tailwind + tokens de Vix)
import "./globals.css";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Vix — Tienda online",
    template: "%s | Vix",
  },
  description:
    "Vix: tecnología, moda y estilo de vida. Productos seleccionados con envío seguro.",
};

export default async function RootLayout({ children }) {
  const noticeProducts = await getNoticeProducts();

  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper text-ink">
        <CartProvider>
          <TopBar />
          <Header />
          <CategoryNav />

          <main className="flex-1">{children}</main>

          <Footer />
          <WhatsAppButton />
          <CornerNotice products={noticeProducts} />
        </CartProvider>
      </body>
    </html>
  );
}
