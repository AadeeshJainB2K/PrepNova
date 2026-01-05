"use server";

import { db } from "@/lib/db";
import { productReviews } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Get reviews for a product
export async function getProductReviews(productId: string) {
  try {
    const reviews = await db.query.productReviews.findMany({
      where: eq(productReviews.productId, productId),
      orderBy: [desc(productReviews.createdAt)],
      with: {
        user: {
          columns: {
            name: true,
            image: true,
          },
        },
      },
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

// Add a review
export async function addProductReview(
  productId: string,
  rating: number,
  comment: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    if (rating < 1 || rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5" };
    }

    if (!comment.trim()) {
      return { success: false, error: "Comment cannot be empty" };
    }

    await db.insert(productReviews).values({
      productId,
      userId: session.user.id,
      rating,
      comment: comment.trim(),
    });

    revalidatePath(`/dashboard/marketplace/${productId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding review:", error);
    return { success: false, error: "Failed to add review" };
  }
}

// Get average rating for a product
export async function getProductRating(productId: string) {
  try {
    const reviews = await db.query.productReviews.findMany({
      where: eq(productReviews.productId, productId),
      columns: {
        rating: true,
      },
    });

    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / reviews.length;

    return { average, count: reviews.length };
  } catch (error) {
    console.error("Error getting product rating:", error);
    return { average: 0, count: 0 };
  }
}

// Delete a review (only by the user who created it)
export async function deleteProductReview(reviewId: string, productId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify the review belongs to the user
    const review = await db.query.productReviews.findFirst({
      where: eq(productReviews.id, reviewId),
    });

    if (!review) {
      return { success: false, error: "Review not found" };
    }

    if (review.userId !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    await db.delete(productReviews).where(eq(productReviews.id, reviewId));

    revalidatePath(`/dashboard/marketplace/${productId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error: "Failed to delete review" };
  }
}
