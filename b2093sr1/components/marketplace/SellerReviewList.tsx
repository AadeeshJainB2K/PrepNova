"use client";

import { useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteSellerReview } from "@/lib/marketplace/seller-review-actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SellerReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface SellerReviewListProps {
  reviews: SellerReview[];
  currentUserId?: string;
}

export function SellerReviewList({ reviews, currentUserId }: SellerReviewListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setDeletingId(reviewId);
    const result = await deleteSellerReview(reviewId);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to delete review");
      setDeletingId(null);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">No reviews yet</p>
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
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              {/* User Avatar */}
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 flex-shrink-0">
                {review.user.image ? (
                  <Image
                    src={review.user.image}
                    alt={review.user.name || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                    {(review.user.name || review.user.email)[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {review.user.name || review.user.email}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Star Rating */}
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
              </div>
            </div>

            {/* Delete Button (only for review author) */}
            {currentUserId === review.user.id && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(review.id)}
                disabled={deletingId === review.id}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
