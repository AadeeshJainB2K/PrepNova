"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  session: { user?: { name?: string | null } } | null;
}

export function MobileMenu({ isOpen, onClose, session }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - z-[100] to be above header (z-50) */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
        onClick={onClose}
      />

      {/* Menu Drawer - z-[110] to be above backdrop */}
      <div className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-900 shadow-xl z-[110] lg:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Menu
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700"
              type="button"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {session?.user ? (
              <Link href="/dashboard" onClick={onClose}>
                <Button
                  variant="default"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                variant="default"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Login
              </Button>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
