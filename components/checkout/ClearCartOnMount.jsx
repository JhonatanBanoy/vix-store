"use client";

import { useEffect, useRef } from "react";

import { useCart } from "../../context/CartContext";

export default function ClearCartOnMount({ enabled = false }) {
  const { clearCart } = useCart();
  const done = useRef(false);

  useEffect(() => {
    if (!enabled || done.current) return;
    done.current = true;
    clearCart();
  }, [clearCart, enabled]);

  return null;
}
