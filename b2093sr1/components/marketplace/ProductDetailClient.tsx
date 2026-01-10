"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/marketplace/actions";
import type { ProductWithSeller } from "@/lib/types/marketplace";

interface ProductDetailClientProps {
  product: ProductWithSeller;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    const result = await addToCart(product.id, quantity);
    
    if (result.success) {
      router.push("/dashboard/marketplace/cart");
    } else {
      alert(result.error || "Failed to add to cart");
      setIsAdding(false);
    }
  };

  const total = parseFloat(product.price) * quantity;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/marketplace">
          <Button variant="ghost" className="mb-4 dark:hover:bg-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </Link>
      </div>

      {/* Product Details */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-4 right-4 bg-orange-500 text-white text-sm px-3 py-1.5 rounded-full">
              Only {product.stock} left!
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1.5 rounded-full">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="mb-3">
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 rounded-full">
                {product.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {product.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {product.description}
            </p>
            {product.seller && (
              <div className="flex items-center gap-2 text-sm mt-3">
                <span className="text-gray-600 dark:text-gray-400">Sold by:</span>
                <Link 
                  href={`/dashboard/marketplace/seller/${product.seller.id}`}
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                >
                  {product.seller.name || product.seller.email}
                </Link>
              </div>
            )}
          </div>

          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                ₹{parseFloat(product.price).toLocaleString()}
              </span>
              <span className="text-gray-500 dark:text-gray-400">per unit</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {product.stock > 0 ? `${product.stock} units available` : "Currently unavailable"}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-12 w-12 p-0 dark:border-gray-600"
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 w-16 text-center">
                  {quantity}
                </span>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="h-12 w-12 p-0 dark:border-gray-600"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {quantity > 1 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-800 dark:text-blue-300">
                    Total for {quantity} units:
                  </span>
                  <span className="text-xl font-bold text-blue-900 dark:text-blue-200">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              {isAdding ? (
                "Adding to Cart..."
              ) : product.stock === 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-green-600 dark:text-green-400">✓</span>
              Free shipping on all orders
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-green-600 dark:text-green-400">✓</span>
              Secure payment processing
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-green-600 dark:text-green-400">✓</span>
              Easy returns within 7 days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
