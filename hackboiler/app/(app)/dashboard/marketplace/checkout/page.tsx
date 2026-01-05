import { getCart } from "@/lib/marketplace/actions";
import { CheckoutForm } from "@/components/marketplace/CheckoutForm";
import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/dashboard");
  }

  // Get user data for pre-filling form
  const userData = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  const cart = await getCart();

  if (cart.length === 0) {
    redirect("/dashboard/marketplace/cart");
  }

  const total = cart.reduce((sum, item) => {
    return sum + parseFloat(item.product!.price) * item.quantity;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Checkout</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Complete your order
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Shipping Information
            </h2>
            <CheckoutForm cartItems={cart} total={total} userName={userData?.name || ""} />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <Image
                      src={item.product!.image}
                      alt={item.product!.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.product!.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      ₹{(parseFloat(item.product!.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="text-green-600 dark:text-green-400">FREE</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
