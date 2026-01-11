"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

interface TopNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  cartCount?: number;
  onMenuClick?: () => void;
}

export function TopNav({ user, onMenuClick }: TopNavProps) {
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="h-14 sm:h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left: Hamburger Menu (Mobile) + Logo + Title */}
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 touch-target"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-3">
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
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
              <p className="hidden md:block text-sm text-gray-500 dark:text-gray-400">Welcome back, {user.name || "User"}!</p>
            </div>
          </div>
          <div className="sm:hidden">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">PrepNova</h1>
          </div>
        </div>

        {/* Right: User Menu + Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          
          <div className="hidden sm:flex items-center gap-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm">
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
              <span className="hidden md:inline">Home</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="gap-2 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
