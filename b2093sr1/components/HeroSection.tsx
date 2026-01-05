"use client";

import Spline from "@splinetool/react-spline";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      
      {/* BACKGROUND SPLINE */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Spline scene="https://prod.spline.design/6ySqnwudeCEaVomX/scene.splinecode" />
      </div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 z-10 bg-black/60" />

      {/* HERO CONTENT */}
      <div className="relative z-20 max-w-3xl px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-semibold text-white leading-tight">
          Build Faster.
          <br />
          <span className="text-neutral-400">Win Hackathons.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-neutral-300">
          A production-ready Next.js boilerplate with Auth, AI, and modern UI —
          built to ship fast and impress judges.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Button size="lg" className="px-8 py-6 text-lg">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-6 text-lg text-white border-white/30">
            View Docs
          </Button>
        </div>
      </div>
    </section>
  );
}
