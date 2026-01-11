import { getOrder } from "@/lib/marketplace/actions";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CancelOrderButton } from "@/components/marketplace/CancelOrderButton";
import { ReorderButton } from "@/components/marketplace/ReorderButton";

const statusConfig = {
  pending: { color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300", label: "Pending" },
  packed: { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300", label: "Packed" },
  shipped: { color: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300", label: "Shipped" },
  delivered: { color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300", label: "Delivered" },
  cancelled: { color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300", label: "Cancelled" },
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    notFound();
  }

  const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Order Details
        </h1>
        <Link href="/dashboard/marketplace/orders">
          <Button variant="outline" className="dark:border-gray-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Details - Left Side */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Order #{order.id.slice(0, 8)}
                  </h2>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(order.createdAt).toLocaleDateString('en-GB')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{parseFloat(order.total).toLocaleString()}
                </p>
              </div>
            </div>

            {/* All Products */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">All Products:</h3>
              {order.orderItems?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-1">
                    <Link
                      href={`/dashboard/marketplace/${item.product.id}`}
                      className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {item.product.name}
                    </Link>
                    {item.product.seller && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Sold by: {item.product.seller.name || item.product.seller.email}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ₹{parseFloat(item.price).toLocaleString()} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Shipping Address
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {order.shippingAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary - Right Side */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order Date</p>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {new Date(order.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {order.status}
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{parseFloat(order.total).toLocaleString()}
                </p>
              </div>
            </div>

            <CancelOrderButton 
              orderId={order.id} 
              orderDate={order.createdAt} 
              orderStatus={order.status} 
            />

            <ReorderButton orderId={order.id} />

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Your order has been placed successfully. You will receive updates via email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
