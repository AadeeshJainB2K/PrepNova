"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, LogOut, ShoppingBag, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

interface TopNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  cartCount?: number;
}

export function TopNav({ user, cartCount = 0 }: TopNavProps) {
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex h-full items-center justify-between px-6">
        {/* Logo + Breadcrumb / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative flex-shrink-0">
            <Image
              src="/logo.png"
              alt="PrepNova Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user.name || "User"}!</p>
          </div>
        </div>

        {/* User Menu + Theme Toggle */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
            </div>
          </div>

          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="gap-2 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

