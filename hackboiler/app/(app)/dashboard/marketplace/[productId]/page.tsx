import { getProduct } from "@/lib/marketplace/actions";
import { getProductReviews, getProductRating } from "@/lib/marketplace/review-actions";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/marketplace/ProductDetailClient";
import { ReviewForm } from "@/components/marketplace/ReviewForm";
import { ReviewList } from "@/components/marketplace/ReviewList";
import { Star } from "lucide-react";
import { auth } from "@/auth";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const [product, reviews, ratingData, session] = await Promise.all([
    getProduct(productId),
    getProductReviews(productId),
    getProductRating(productId),
    auth(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <ProductDetailClient product={product as any} />

      {/* Reviews Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Customer Reviews
          </h2>
          {ratingData.count > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(ratingData.average)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {ratingData.average.toFixed(1)}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                ({ratingData.count} {ratingData.count === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ReviewForm productId={productId} />
          </div>
          <div className="lg:col-span-2">
            <ReviewList reviews={reviews as any} currentUserId={session?.user?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
