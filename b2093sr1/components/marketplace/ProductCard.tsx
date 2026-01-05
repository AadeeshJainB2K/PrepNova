"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/marketplace/types";
import { addToCart } from "@/lib/marketplace/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    
    const result = await addToCart(product.id, 1);
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to add to cart");
    }
    
    setIsAdding(false);
  };

  return (
    <Link
      href={`/dashboard/marketplace/${product.id}`}
      className="group block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ₹{parseFloat(product.price).toLocaleString()}
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            {isAdding ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </Link>
  );
}
