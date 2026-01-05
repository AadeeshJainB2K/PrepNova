"use server";

import { db } from "@/lib/db";
import { products, cartItems, orders, orderItems } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/auth";

// Get all active products
export async function getProducts() {
  try {
    const allProducts = await db.query.products.findMany({
      where: eq(products.isActive, true),
      orderBy: [desc(products.createdAt)],
    });
    return allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Get single product by ID
export async function getProduct(productId: string) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        seller: true, // Include seller information
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Get user's cart
export async function getCart() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const cart = await db.query.cartItems.findMany({
      where: eq(cartItems.userId, session.user.id),
      with: {
        product: true,
      },
    });
    return cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}

// Add item to cart
export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    // Check if item already in cart
    const existing = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.userId, session.user.id),
        eq(cartItems.productId, productId)
      ),
    });

    if (existing) {
      // Update quantity
      await db
        .update(cartItems)
        .set({ quantity: existing.quantity + quantity })
        .where(eq(cartItems.id, existing.id));
    } else {
      // Add new item
      await db.insert(cartItems).values({
        userId: session.user.id,
        productId,
        quantity,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "Failed to add to cart" };
  }
}

// Remove item from cart
export async function removeFromCart(cartItemId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(cartItems.userId, session.user.id)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: "Failed to remove from cart" };
  }
}

// Update cart item quantity
export async function updateCartQuantity(cartItemId: string, quantity: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }

    await db
      .update(cartItems)
      .set({ quantity })
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(cartItems.userId, session.user.id)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Error updating cart:", error);
    return { success: false, error: "Failed to update cart" };
  }
}

// Create order
export async function createOrder(shippingAddress: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    // Get cart items
    const cart = await db.query.cartItems.findMany({
      where: eq(cartItems.userId, session.user.id),
      with: {
        product: true,
      },
    });

    if (cart.length === 0) {
      return { success: false, error: "Cart is empty" };
    }

    // Calculate total
    const total = cart.reduce((sum, item) => {
      return sum + parseFloat(item.product!.price) * item.quantity;
    }, 0);

    // Create order
    const [order] = await db
      .insert(orders)
      .values({
        userId: session.user.id,
        total: total.toFixed(2),
        status: "pending",
        shippingAddress,
      })
      .returning();

    // Create order items
    for (const item of cart) {
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product!.price,
      });
    }

    // Clear cart
    await db.delete(cartItems).where(eq(cartItems.userId, session.user.id));

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

// Get user's orders
export async function getOrders() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, session.user.id),
      orderBy: [desc(orders.createdAt)],
      with: {
        orderItems: {
          with: {
            product: true,
          },
        },
      },
    });

    return userOrders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// Get single order
export async function getOrder(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.userId, session.user.id)),
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

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

// Cancel order (within 8 hours)
export async function cancelOrder(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Get the order
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.userId, session.user.id)),
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // Check if already cancelled or delivered
    if (order.status === "cancelled") {
      return { success: false, error: "Order is already cancelled" };
    }

    if (order.status === "delivered") {
      return { success: false, error: "Cannot cancel delivered order" };
    }

    // Check if within 2 hours
    const orderTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const hoursSinceOrder = (currentTime - orderTime) / (1000 * 60 * 60);

    if (hoursSinceOrder > 2) {
      return { success: false, error: "Cancellation window expired (2 hours)" };
    }

    // Cancel the order
    await db.update(orders).set({ status: "cancelled" }).where(eq(orders.id, orderId));

    return { success: true };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return { success: false, error: "Failed to cancel order" };
  }
}

// Reorder - create a new order with same items
export async function reorderOrder(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Get the original order
    const originalOrder = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.userId, session.user.id)),
      with: {
        orderItems: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!originalOrder) {
      return { success: false, error: "Order not found" };
    }

    // Check if all products are still available
    for (const item of originalOrder.orderItems) {
      if (!item.product.isActive) {
        return { success: false, error: `Product "${item.product.name}" is no longer available` };
      }
      if (item.product.stock < item.quantity) {
        return { success: false, error: `Insufficient stock for "${item.product.name}"` };
      }
    }

    // Calculate new total
    const newTotal = originalOrder.orderItems.reduce(
      (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
      0
    );

    // Create new order
    const newOrderId = crypto.randomUUID();
    await db.insert(orders).values({
      id: newOrderId,
      userId: session.user.id,
      total: newTotal.toString(),
      status: "pending",
      shippingAddress: originalOrder.shippingAddress,
    });

    // Create order items
    for (const item of originalOrder.orderItems) {
      await db.insert(orderItems).values({
        orderId: newOrderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      });

      // Update product stock
      await db
        .update(products)
        .set({
          stock: item.product.stock - item.quantity,
        })
        .where(eq(products.id, item.productId));
    }

    return { success: true, orderId: newOrderId };
  } catch (error) {
    console.error("Error reordering:", error);
    return { success: false, error: "Failed to create new order" };
  }
}

// Search products for chat integration
export async function searchProducts(query: string) {
  try {
    const searchTerm = query.toLowerCase();
    
    const allProducts = await db.query.products.findMany({
      where: eq(products.isActive, true),
      with: {
        seller: true,
      },
    });

    // Filter products by name, description, or category
    const matchingProducts = allProducts.filter((product) => {
      const productName = product.name.toLowerCase();
      const productDesc = product.description.toLowerCase();
      const productCat = product.category.toLowerCase();
      
      // Check if the full search term contains the product name or vice versa
      if (searchTerm.includes(productName) || productName.includes(searchTerm)) {
        return true;
      }
      
      // Check individual words in the query
      const words = searchTerm.split(' ').filter(w => w.length > 2);
      return words.some(word => 
        productName.includes(word) ||
        productDesc.includes(word) ||
        productCat.includes(word)
      );
    });

    console.log(`[searchProducts] Query: "${query}" -> Found ${matchingProducts.length} products`);
    if (matchingProducts.length > 0) {
      console.log(`[searchProducts] Matches:`, matchingProducts.map(p => p.name).join(', '));
    }
    
    return matchingProducts.slice(0, 5); // Return top 5 matches
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}
