"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

import { useCart } from "../../context/CartContext";
import Button from "../ui/Button";

export default function AddToCartButton({
  product,
  goToCart = false,
  className,
  children,
}) {
  const { addToCart } = useCart();
  const router = useRouter();

  const outOfStock = product.stock <= 0;

  const handleClick = () => {
    if (outOfStock) return;
    addToCart(product);
    if (goToCart) router.push("/cart");
  };

  return (
    <Button
      onClick={handleClick}
      disabled={outOfStock}
      size="lg"
      className={className}
    >
      <ShoppingBag className="h-4 w-4" />
      {outOfStock ? "Agotado" : children || "Añadir al carrito"}
    </Button>
  );
}
