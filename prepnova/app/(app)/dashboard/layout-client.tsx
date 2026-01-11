"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
  cartCount: number;
}

export function DashboardLayoutClient({ children, user, cartCount }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Desktop: always visible, Mobile: drawer */}
      <AppSidebar 
        user={user} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav 
          user={user} 
          cartCount={cartCount}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        {/* Main Content with bottom padding for mobile nav */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 pb-20 lg:pb-6 mobile-scroll" data-user-name={user.name || ''}>
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
}
