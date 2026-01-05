"use server";

import { db } from "@/lib/db";
import { orders, orderItems, products, users } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { auth } from "@/auth";

// Get orders for a specific seller (orders containing their products)
export async function getSellerOrders() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }

    // Check if user is admin
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    const isAdmin = currentUser?.role === "admin";

    // Get all orders with their items
    const allOrders = await db.query.orders.findMany({
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      with: {
        user: true,
        orderItems: {
          with: {
            product: {
              with: {
                seller: true,
              },
            },
          },
        },
      },
    });

    // If admin, return all orders with all products
    if (isAdmin) {
      return allOrders.map((order: any) => ({
        ...order,
        sellerTotal: order.orderItems.reduce(
          (sum: number, item: any) => sum + parseFloat(item.price) * item.quantity,
          0
        ),
        isAdminView: true,
      }));
    }

    // For sellers, filter to show only orders containing their products
    const sellerOrders = allOrders
      .map((order: any) => {
        // Filter items to only include seller's products
        const sellerItems = order.orderItems.filter(
          (item: any) => item.product?.seller?.id === session.user!.id
        );

        if (sellerItems.length === 0) return null;

        // Calculate total for seller's items only
        const sellerTotal = sellerItems.reduce(
          (sum: number, item: any) => sum + parseFloat(item.price) * item.quantity,
          0
        );

        return {
          ...order,
          orderItems: sellerItems,
          sellerTotal,
          isAdminView: false,
        };
      })
      .filter((order: any) => order !== null);

    return sellerOrders;
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    return [];
  }
}

// Get all orders (admin only)
export async function getAllOrders() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }

    const allOrders = await db.query.orders.findMany({
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      with: {
        user: true,
        orderItems: {
          with: {
            product: true,
          },
        },
      },
    });

    return allOrders;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
}

// Update order status (seller only)
export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Validate status
    const validStatuses = ["pending", "packed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: "Invalid status" };
    }

    // Get the order with its items to verify seller owns products
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        orderItems: {
          with: {
            product: {
              with: {
                seller: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // Check if seller owns at least one product in this order
    const sellerOwnsProduct = order.orderItems.some(
      (item: any) => item.product?.seller?.id === session.user!.id
    );

    if (!sellerOwnsProduct) {
      return { success: false, error: "Unauthorized" };
    }

    // Update order status
    await db.update(orders).set({ status: newStatus }).where(eq(orders.id, orderId));

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
