"use server";

import { db } from "@/lib/db";
import { sellerReviews } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Get all reviews for a seller
export async function getSellerReviews(sellerId: string) {
  try {
    const reviews = await db.query.sellerReviews.findMany({
      where: eq(sellerReviews.sellerId, sellerId),
      orderBy: [desc(sellerReviews.createdAt)],
      with: {
        user: true,
      },
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching seller reviews:", error);
    return [];
  }
}

// Get average rating for a seller
export async function getSellerRating(sellerId: string) {
  try {
    const reviews = await db.query.sellerReviews.findMany({
      where: eq(sellerReviews.sellerId, sellerId),
    });

    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;

    return { average, count: reviews.length };
  } catch (error) {
    console.error("Error calculating seller rating:", error);
    return { average: 0, count: 0 };
  }
}

// Add a review for a seller
export async function addSellerReview(
  sellerId: string,
  rating: number,
  comment: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if user already reviewed this seller
    const existingReview = await db.query.sellerReviews.findFirst({
      where: and(
        eq(sellerReviews.sellerId, sellerId),
        eq(sellerReviews.userId, session.user.id)
      ),
    });

    if (existingReview) {
      return { success: false, error: "You have already reviewed this seller" };
    }

    // Don't allow sellers to review themselves
    if (sellerId === session.user.id) {
      return { success: false, error: "You cannot review yourself" };
    }

    await db.insert(sellerReviews).values({
      sellerId,
      userId: session.user.id,
      rating,
      comment,
    });

    revalidatePath(`/dashboard/marketplace/seller/${sellerId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding seller review:", error);
    return { success: false, error: "Failed to add review" };
  }
}

// Delete a seller review
export async function deleteSellerReview(reviewId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Get the review to check ownership
    const review = await db.query.sellerReviews.findFirst({
      where: eq(sellerReviews.id, reviewId),
    });

    if (!review) {
      return { success: false, error: "Review not found" };
    }

    // Only allow the review author to delete their review
    if (review.userId !== session.user.id) {
      return { success: false, error: "You can only delete your own reviews" };
    }

    await db.delete(sellerReviews).where(eq(sellerReviews.id, reviewId));
    revalidatePath(`/dashboard/marketplace/seller/${review.sellerId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting seller review:", error);
    return { success: false, error: "Failed to delete review" };
  }
}
