"use client";

import { useState } from "react";
import { Package, Calendar, User, MapPin } from "lucide-react";
import Link from "next/link";
import { OrderStatusDropdown } from "@/components/marketplace/OrderStatusDropdown";
import { OrderSearch } from "@/components/marketplace/OrderSearch";

interface SellerOrdersClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orders: any[];
  isAdminView: boolean;
}

export function SellerOrdersClient({ orders, isAdminView }: SellerOrdersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const matchesOrderId = order.id.toLowerCase().includes(query);
    const matchesCustomer = order.user?.name?.toLowerCase().includes(query) || 
                           order.user?.email?.toLowerCase().includes(query);
    const matchesProduct = order.orderItems?.some((item: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
      item.product?.name?.toLowerCase().includes(query)
    );
    return matchesOrderId || matchesCustomer || matchesProduct;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            My Orders
          </h1>
          {isAdminView && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
              Admin View - All Products
            </span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {isAdminView ? "All orders in the system" : "Orders containing your products"}
        </p>
      </div>

      {/* Search */}
      {orders.length > 0 && (
        <OrderSearch onSearch={setSearchQuery} placeholder="Search by order ID, customer name, or product..." />
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Orders containing your products will appear here
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No matching orders
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {filteredOrders.map((order: any) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              {/* Order Header */}
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {order.user?.name || order.user?.email}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{isAdminView ? "Total" : "Your Total"}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{order.sellerTotal.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {isAdminView ? "All Products:" : "Your Products:"}
                </h4>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {order.orderItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">
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

              {/* Shipping Address */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Shipping Address
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {order.shippingAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
