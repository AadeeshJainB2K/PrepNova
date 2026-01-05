"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/marketplace/admin-actions";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteProduct(productId);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to delete product");
      setIsDeleting(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
