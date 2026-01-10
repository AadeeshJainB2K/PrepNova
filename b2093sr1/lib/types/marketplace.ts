/**
 * Centralized type definitions for marketplace entities
 * Based on database schema in lib/db/schema.ts
 */

import type { products, orders, orderItems, productReviews, sellerReviews, users } from "@/lib/db/schema";

/**
 * Product type from database
 */
export type Product = typeof products.$inferSelect;

/**
 * New product data for insertion
 */
export type NewProduct = typeof products.$inferInsert;

/**
 * Order type from database
 */
export type Order = typeof orders.$inferSelect;

/**
 * New order data for insertion
 */
export type NewOrder = typeof orders.$inferInsert;

/**
 * Order item type from database
 */
export type OrderItem = typeof orderItems.$inferSelect;

/**
 * New order item data for insertion
 */
export type NewOrderItem = typeof orderItems.$inferInsert;

/**
 * Product review type from database
 */
export type ProductReview = typeof productReviews.$inferSelect;

/**
 * New product review data for insertion
 */
export type NewProductReview = typeof productReviews.$inferInsert;

/**
 * Seller review type from database
 */
export type SellerReview = typeof sellerReviews.$inferSelect;

/**
 * New seller review data for insertion
 */
export type NewSellerReview = typeof sellerReviews.$inferInsert;

/**
 * Seller type (user with seller role)
 */
export type Seller = typeof users.$inferSelect;

/**
 * Order with related items and product details
 */
export interface OrderWithItems extends Order {
  orderItems: (OrderItem & {
    product: Product;
  })[];
}

/**
 * Product with seller information
 */
export interface ProductWithSeller extends Product {
  seller: Seller | null;
}

/**
 * Product with reviews
 */
export interface ProductWithReviews extends Product {
  reviews: (ProductReview & {
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  })[];
}

/**
 * Order status types
 */
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

/**
 * Product category types
 */
export type ProductCategory = string; // Can be made more specific based on your categories
