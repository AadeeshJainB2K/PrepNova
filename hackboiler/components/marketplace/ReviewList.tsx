"use client";

import { Star, User, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProductReview } from "@/lib/marketplace/review-actions";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  userId: string;
  productId: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
}

export function ReviewList({ reviews, currentUserId }: ReviewListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (reviewId: string, productId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setDeletingId(reviewId);
    const result = await deleteProductReview(reviewId, productId);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to delete review");
    }
    
    setDeletingId(null);
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-start gap-4">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              {review.user.image ? (
                <Image
                  src={review.user.image}
                  alt={review.user.name || "User"}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </div>

            {/* Review Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {review.user.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  {/* Delete button - only show for review author */}
                  {currentUserId && currentUserId === review.userId && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(review.id, review.productId)}
                      disabled={deletingId === review.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {review.comment}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
