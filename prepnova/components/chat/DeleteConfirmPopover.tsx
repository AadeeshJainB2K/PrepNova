"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

interface DeleteConfirmPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmPopover({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeleteConfirmPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleDismiss = () => {
    onOpenChange(false);
  };

  // Close on click outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    // Delay adding listener to prevent immediate close
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute top-full left-0 right-0 mt-1 z-[100] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
          Delete chat?
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            disabled={isDeleting}
            className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Dismiss
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
