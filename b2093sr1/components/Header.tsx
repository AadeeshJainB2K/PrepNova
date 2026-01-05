import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn, auth } from "@/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Header() {
  const session = await auth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              b2093sr1
            </span>
          </Link>

          {/* Right side: Theme Toggle + Login/Dashboard */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {session?.user ? (
              <Link href="/dashboard">
                <Button variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: "/dashboard" });
                }}
              >
                <Button type="submit" variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Login
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
