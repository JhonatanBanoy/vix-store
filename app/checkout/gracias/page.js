import OrderSuccess from "../../../components/checkout/OrderSuccess";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pedido recibido",
  description: "Consulta el estado de tu pedido en Vix.",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({ searchParams }) {
  const params = await searchParams;
  const token = typeof params?.token === "string" ? params.token : "";
  const transactionId = typeof params?.id === "string" ? params.id : "";

  return <OrderSuccess token={token} transactionId={transactionId} />;
}
