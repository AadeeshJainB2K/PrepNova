import { getSellerOrders } from "@/lib/marketplace/seller-order-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SellerOrdersClient } from "@/components/marketplace/SellerOrdersClient";

export default async function SellerOrdersPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/dashboard");
  }

  // Check if user is seller or admin
  const currentUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!currentUser || (currentUser.role !== "seller" && currentUser.role !== "admin")) {
    redirect("/dashboard");
  }

  const orders = await getSellerOrders();
  const isAdminView = orders.length > 0 && (orders[0] as any).isAdminView;

  return <SellerOrdersClient orders={orders} isAdminView={isAdminView} />;
}
