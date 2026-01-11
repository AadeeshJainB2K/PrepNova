import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardLayoutClient } from "./layout-client";
import { db } from "@/lib/db";
import { users, cartItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) {
    redirect("/");
  }

  // Get cart count
  const cart = await db.query.cartItems.findMany({
    where: eq(cartItems.userId, user.id),
  });
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <DashboardLayoutClient user={user} cartCount={cartCount}>
      {children}
    </DashboardLayoutClient>
  );
}
