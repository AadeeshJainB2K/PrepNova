"use client";

import { useState } from "react";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import Link from "next/link";
import { OrderSearch } from "@/components/marketplace/OrderSearch";

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20", label: "Pending" },
  packed: { icon: Package, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", label: "Packed" },
  shipped: { icon: Truck, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", label: "Cancelled" },
};

interface OrdersClientProps {
  orders: any[];
}

export function OrdersClient({ orders }: OrdersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const matchesOrderId = order.id.toLowerCase().includes(query);
    const matchesProduct = order.orderItems?.some((item: any) =>
      item.product?.name?.toLowerCase().includes(query)
    );
    const matchesStatus = order.status.toLowerCase().includes(query);
    return matchesOrderId || matchesProduct || matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Orders</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track and manage your orders
        </p>
      </div>

      {/* Search */}
      {orders.length > 0 && (
        <OrderSearch onSearch={setSearchQuery} placeholder="Search by order ID, product name, or status..." />
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Package className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start shopping to see your orders here!
          </p>
          <Link
            href="/dashboard/marketplace"
            className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg"
          >
            Browse Products
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Package className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No matching orders
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;

            return (
              <Link
                key={order.id}
                href={`/dashboard/marketplace/orders/${order.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Order ID: <span className="font-mono">{order.id.slice(0, 8)}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg}`}>
                    <StatusIcon className={`h-4 w-4 ${status.color}`} />
                    <span className={`text-sm font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.orderItems?.length || 0} {order.orderItems?.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ₹{parseFloat(order.total).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
