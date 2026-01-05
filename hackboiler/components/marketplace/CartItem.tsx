"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCartQuantity, removeFromCart } from "@/lib/marketplace/actions";

interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: string;
      image: string;
      stock: number;
    };
  };
  onQuantityChange?: (itemId: string, newQuantity: number) => void;
  onRemove?: (itemId: string) => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock) return;

    // Update UI immediately
    setLocalQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(item.id, newQuantity);
    }

    // Update in background
    setIsUpdating(true);
    await updateCartQuantity(item.id, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    // Update UI immediately
    if (onRemove) {
      onRemove(item.id);
    }

    // Remove in background
    await removeFromCart(item.id);
  };

  const itemTotal = parseFloat(item.product.price) * localQuantity;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link
          href={`/dashboard/marketplace/${item.product.id}`}
          className="relative w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
        >
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/dashboard/marketplace/${item.product.id}`}
            className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
          >
            {item.product.name}
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            ₹{parseFloat(item.product.price).toLocaleString()} per unit
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {item.product.stock} available
          </p>
        </div>

        {/* Quantity Controls & Price */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuantityChange(localQuantity - 1)}
              disabled={localQuantity <= 1 || isUpdating}
              className="h-8 w-8 p-0 dark:border-gray-600"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-semibold text-gray-900 dark:text-gray-100">
              {localQuantity}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuantityChange(localQuantity + 1)}
              disabled={localQuantity >= item.product.stock || isUpdating}
              className="h-8 w-8 p-0 dark:border-gray-600"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ₹{itemTotal.toLocaleString()}
            </p>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
