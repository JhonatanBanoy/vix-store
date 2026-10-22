import CartClient from "../../components/cart/CartClient";

export const metadata = {
  title: "Carrito",
  description: "Revisa los productos de tu carrito antes de finalizar la compra.",
};

export default function CartPage() {
  return <CartClient />;
}
