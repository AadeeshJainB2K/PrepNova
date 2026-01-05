"use client";

import { useState, useEffect } from "react";
import { cancelOrder } from "@/lib/marketplace/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface CancelOrderButtonProps {
  orderId: string;
  orderDate: Date;
  orderStatus: string;
}

export function CancelOrderButton({ orderId, orderDate, orderStatus }: CancelOrderButtonProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [canCancel, setCanCancel] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const orderTime = new Date(orderDate).getTime();
      const currentTime = new Date().getTime();
      const twoHoursInMs = 2 * 60 * 60 * 1000;
      const deadline = orderTime + twoHoursInMs;
      const remaining = deadline - currentTime;

      // Check if can cancel
      const isWithinWindow = remaining > 0 && orderStatus !== "cancelled" && orderStatus !== "delivered";
      setCanCancel(isWithinWindow);

      if (remaining > 0) {
        // Calculate hours, minutes, seconds
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining("Expired");
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [orderDate, orderStatus]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      return;
    }

    setIsCancelling(true);
    const result = await cancelOrder(orderId);

    if (result.success) {
      alert("Order cancelled successfully");
      router.refresh();
    } else {
      alert(result.error || "Failed to cancel order");
      setIsCancelling(false);
    }
  };

  if (!canCancel) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCancel}
        disabled={isCancelling}
        variant="outline"
        className="w-full border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <XCircle className="h-4 w-4 mr-2" />
        {isCancelling ? "Cancelling..." : "Cancel Order"}
      </Button>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Cancel within {timeRemaining}
      </p>
    </div>
  );
}
