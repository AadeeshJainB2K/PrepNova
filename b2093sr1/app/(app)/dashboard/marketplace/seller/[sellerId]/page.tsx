import { db } from "@/lib/db";
import { products, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Package } from "lucide-react";
import { getSellerReviews, getSellerRating } from "@/lib/marketplace/seller-review-actions";
import { SellerReviewForm } from "@/components/marketplace/SellerReviewForm";
import { SellerReviewList } from "@/components/marketplace/SellerReviewList";
import { auth } from "@/auth";

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ sellerId: string }>;
}) {
  const { sellerId } = await params;

  // Get seller info, products, reviews, and session
  const [seller, sellerProducts, reviews, ratingData, session] = await Promise.all([
    db.query.users.findFirst({
      where: eq(users.id, sellerId),
    }),
    db.query.products.findMany({
      where: eq(products.sellerId, sellerId),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
    }),
    getSellerReviews(sellerId),
    getSellerRating(sellerId),
    auth(),
  ]);

  if (!seller) {
    notFound();
  }

  const activeProducts = sellerProducts.filter(p => p.isActive);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/marketplace">
        <Button variant="ghost" className="mb-4 dark:hover:bg-gray-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>
      </Link>

      {/* Seller Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-6">
          {/* Seller Avatar */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
            {seller.image ? (
              <Image src={seller.image} alt={seller.name || "Seller"} fill className="object-cover" />
            ) : (
              <span className="text-4xl font-bold text-white">
                {(seller.name || seller.email || "S")[0].toUpperCase()}
              </span>
            )}
          </div>

          {/* Seller Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {seller.name || "Seller"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {seller.email}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {activeProducts.length} {activeProducts.length === 1 ? 'Product' : 'Products'}
                </span>
              </div>
              {seller.role === "seller" && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  Verified Seller
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seller's Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Products by {seller.name || "this seller"}
        </h2>
        
        {activeProducts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No products yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This seller hasn&apos;t listed any products yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeProducts.map((product) => (
              <Link
                key={product.id}
                href={`/dashboard/marketplace/${product.id}`}
                className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      ₹{parseFloat(product.price).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {product.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Seller Reviews Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Seller Reviews
        </h2>
        
        {/* Average Rating */}
        {ratingData.count > 0 && (
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= Math.round(ratingData.average)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {ratingData.average.toFixed(1)}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              ({ratingData.count} {ratingData.count === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <SellerReviewForm sellerId={sellerId} />
          </div>

          {/* Review List */}
          <div className="lg:col-span-2">
            <SellerReviewList reviews={reviews as any} currentUserId={session?.user?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
