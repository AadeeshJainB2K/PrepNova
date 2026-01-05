"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/marketplace/seller-order-actions";
import { useRouter } from "next/navigation";

interface OrderStatusDropdownProps {
  orderId: string;
  currentStatus: string;
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300" },
  { value: "packed", label: "Packed", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" },
  { value: "shipped", label: "Shipped", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300" },
];

export function OrderStatusDropdown({ orderId, currentStatus }: OrderStatusDropdownProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;

    setIsUpdating(true);
    setStatus(newStatus); // Optimistic update

    const result = await updateOrderStatus(orderId, newStatus);

    if (result.success) {
      router.refresh();
    } else {
      // Revert on error
      setStatus(currentStatus);
      alert(result.error || "Failed to update status");
    }

    setIsUpdating(false);
  };

  const currentOption = statusOptions.find(opt => opt.value === status);

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isUpdating}
        className={`px-3 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${
          currentOption?.color || statusOptions[0].color
        } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {isUpdating && (
        <span className="text-xs text-gray-500 dark:text-gray-400">Updating...</span>
      )}
    </div>
  );
}
