"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileMenu } from "@/components/MobileMenu";
import { Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  session: { user?: { name?: string | null } } | null;
}

export function Header({ session }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-5 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-6xl px-4">
        <div
          className="
            pointer-events-auto
            flex items-center justify-between
            rounded-2xl
            bg-black/60
            backdrop-blur-2xl
            border border-white/10
            px-4 sm:px-6 py-3
            shadow-[0_20px_60px_rgba(0,0,0,0.6)]
          "
        >
          {/* Brand */}
          <Link
            href="/"
            className="text-sm font-medium tracking-wide text-white/90 hover:text-white transition"
          >
            PrepNova
          </Link>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Desktop Login/Dashboard */}
            <div className="hidden sm:block">
              {session?.user ? (
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="
                      rounded-lg
                      bg-white/10
                      text-white
                      hover:bg-white/20
                      border border-white/10
                    "
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  size="sm"
                  className="
                    rounded-lg
                    bg-white
                    text-black
                    hover:bg-neutral-200
                  "
                >
                  Log in
                </Button>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              <Menu className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        session={session}
      />
    </header>
  );
}
