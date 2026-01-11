"use server";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// Admin: Create product
export async function createProduct(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      image: formData.get("image") as string,
      category: formData.get("category") as string,
      stock: parseInt(formData.get("stock") as string),
      isActive: formData.get("isActive") === "true",
      sellerId: session.user.id, // Set seller to current user
    };

    await db.insert(products).values(productData);
    revalidatePath("/dashboard/marketplace");
    
    return { success: true };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

// Delete a product
export async function deleteProduct(productId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Get the product to check ownership
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // Get current user's role
    const { users } = await import("@/lib/db/schema");
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    // Check if user is admin or the seller who created the product
    const isAdmin = user?.role === "admin";
    const isOwner = product.sellerId === session.user.id;

    if (!isAdmin && !isOwner) {
      return { success: false, error: "You can only delete your own products" };
    }

    await db.delete(products).where(eq(products.id, productId));
    revalidatePath("/dashboard/marketplace/admin/products");
    revalidatePath("/dashboard/marketplace");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

// Admin: Update product
export async function updateProduct(productId: string, formData: FormData) {
  try {
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      image: formData.get("image") as string,
      category: formData.get("category") as string,
      stock: parseInt(formData.get("stock") as string),
      isActive: formData.get("isActive") === "true",
      updatedAt: new Date(),
    };

    await db.update(products).set(productData).where(eq(products.id, productId));
    revalidatePath("/dashboard/marketplace");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

// Admin: Get all products (including inactive)
export async function getAllProducts() {
  try {
    const allProducts = await db.query.products.findMany({
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      with: {
        seller: true, // Include seller information
      },
    });
    return allProducts;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}
