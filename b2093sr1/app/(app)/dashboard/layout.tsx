import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNav } from "@/components/dashboard/TopNav";
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AppSidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav user={user} cartCount={cartCount} />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6" data-user-name={user.name || ''}>
          {children}
        </main>
      </div>
    </div>
  );
}
