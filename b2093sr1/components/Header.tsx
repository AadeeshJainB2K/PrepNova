import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn, auth } from "@/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Header() {
  const session = await auth();

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
            px-6 py-3
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
          <div className="flex items-center gap-3">
            <ThemeToggle />

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
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: "/dashboard" });
                }}
              >
                <Button
                  type="submit"
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
              </form>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
