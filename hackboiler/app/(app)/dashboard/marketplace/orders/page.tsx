import { getOrders } from "@/lib/marketplace/actions";
import { OrdersClient } from "@/components/marketplace/OrdersClient";

export default async function OrdersPage() {
  const orders = await getOrders();

  return <OrdersClient orders={orders} />;
}
