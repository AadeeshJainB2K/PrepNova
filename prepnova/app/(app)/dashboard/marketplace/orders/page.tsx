import { getOrders } from "@/lib/marketplace/actions";
import { OrdersClient } from "@/components/marketplace/OrdersClient";

// Force dynamic rendering for authenticated routes
export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await getOrders();

  return <OrdersClient orders={orders} />;
}
