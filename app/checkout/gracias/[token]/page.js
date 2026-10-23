import OrderSuccess from "../../../../components/checkout/OrderSuccess";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pedido recibido",
  description: "Consulta el estado de tu pedido en Vix.",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessByTokenPage({
  params,
  searchParams,
}) {
  const routeParams = await params;
  const query = await searchParams;
  const token =
    typeof routeParams?.token === "string" ? routeParams.token : "";
  const transactionId = typeof query?.id === "string" ? query.id : "";

  return <OrderSuccess token={token} transactionId={transactionId} />;
}
