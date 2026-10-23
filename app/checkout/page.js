import CheckoutClient from "../../components/checkout/CheckoutClient";

export const metadata = {
  title: "Finalizar compra",
  description:
    "Compra como invitado, ingresa tu dirección y paga en línea o contra entrega.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
