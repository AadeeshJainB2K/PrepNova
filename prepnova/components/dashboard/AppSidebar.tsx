"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Brain, TrendingUp, Users, Sparkles, Calendar, ShoppingBag, MessageSquare, Settings, Shield, Package, ShoppingCart, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Navigation configuration - easily extensible for future features
export const navItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Exams",
    href: "/dashboard/exams",
    icon: BookOpen,
  },
  {
    name: "Mock Tests",
    href: "/dashboard/mock-tests",
    icon: Brain,
  },
  {
    name: "My Progress",
    href: "/dashboard/progress",
    icon: TrendingUp,
  },
  {
    name: "Study Groups",
    href: "/dashboard/study-groups",
    icon: Users,
  },
  {
    name: "AI Predictor",
    href: "/dashboard/predictor",
    icon: Sparkles,
  },
  {
    name: "Scheduler",
    href: "/dashboard/scheduler",
    icon: Calendar,
  },
  {
    name: "Marketplace",
    href: "/dashboard/marketplace",
    icon: ShoppingBag,
  },
  {
    name: "Chat",
    href: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    name: "Manage Products",
    href: "/dashboard/marketplace/admin/products",
    icon: Package,
    sellerOnly: true, // Show for sellers and admins
  },
  {
    name: "Orders",
    href: "/dashboard/marketplace/seller/orders",
    icon: ShoppingCart,
    sellerOnly: true,
  },
  {
    name: "Admin",
    href: "/dashboard/admin/users",
    icon: Shield,
    adminOnly: true,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface AppSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ user, isOpen = true, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed lg:relative h-screen border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-transform duration-300 z-50",
          "w-64",
          // Mobile: slide in from left
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 touch-target z-10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}

        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-700 px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex-shrink-0 relative">
              <Image
                src="/logo.png"
                alt="PrepNova Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PrepNova
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto mobile-scroll">
          {navItems
            .filter((item) => {
              // Show admin-only items only to admins
              if (item.adminOnly && user.role !== "admin") return false;
              // Show seller-only items to sellers and admins
              if (item.sellerOnly && user.role !== "seller" && user.role !== "admin") return false;
              return true;
            })
            .map((item) => {
              const Icon = item.icon;
              // For home page, only match exact path
              // For marketplace, don't match admin routes
              // For others, match if path starts with href
              let isActive = false;
              if (item.href === "/dashboard") {
                isActive = pathname === "/dashboard";
              } else if (item.href === "/dashboard/marketplace") {
                isActive = pathname.startsWith("/dashboard/marketplace") && !pathname.includes("/admin");
              } else {
                isActive = pathname.startsWith(item.href);
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors touch-target",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
        </nav>

        {/* Footer - Credits Display */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Credits</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              0
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ready for AI features</div>
          </div>
        </div>
      </aside>
    </>
  );
}
