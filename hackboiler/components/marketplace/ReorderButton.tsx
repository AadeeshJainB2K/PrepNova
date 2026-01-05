"use client";

import { useState } from "react";
import { reorderOrder } from "@/lib/marketplace/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ReorderButtonProps {
  orderId: string;
}

export function ReorderButton({ orderId }: ReorderButtonProps) {
  const router = useRouter();
  const [isReordering, setIsReordering] = useState(false);

  const handleReorder = async () => {
    if (!confirm("Create a new order with the same items?")) {
      return;
    }

    setIsReordering(true);
    const result = await reorderOrder(orderId);

    if (result.success && result.orderId) {
      alert("Order created successfully!");
      router.push(`/dashboard/marketplace/orders/${result.orderId}`);
    } else {
      alert(result.error || "Failed to create order");
      setIsReordering(false);
    }
  };

  return (
    <Button
      onClick={handleReorder}
      disabled={isReordering}
      variant="outline"
      className="w-full border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isReordering ? "animate-spin" : ""}`} />
      {isReordering ? "Creating Order..." : "Reorder"}
    </Button>
  );
}
