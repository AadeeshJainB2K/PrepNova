"use client";

import { motion } from "framer-motion";

const status = [
  "Auth system online",
  "Database connected",
  "AI actions ready",
  "UI components loaded",
  "Build pipeline stable",
];

export function SystemStatusSection() {
  return (
    <section className="relative bg-black py-36 overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-6">

        {/* OUTER GLASS */}
        <div
          className="
            relative
            rounded-3xl
            border border-white/15
            bg-white/[0.04]
            backdrop-blur-2xl
            shadow-[0_0_60px_rgba(255,255,255,0.05)]
            overflow-hidden
          "
        >
          {/* SUBTLE SCAN LIGHT */}
          <div
            className="
              pointer-events-none absolute top-0 left-0 h-full w-1/3
              bg-gradient-to-r from-transparent via-white/[0.04] to-transparent
            "
            style={{
              animation: 'scan 8s linear infinite',
            }}
          />

          {/* HEADER */}
          <div className="px-10 pt-10 pb-6">
            <h3 className="text-xs tracking-[0.3em] text-neutral-400">
              SYSTEM STATUS
            </h3>
          </div>

          {/* STATUS LIST */}
          <div className="px-10 pb-10 font-mono text-sm">
            {status.map((line, i) => (
              <div
                key={line}
                className="
                  flex items-center gap-4 py-3
                  text-neutral-300
                  opacity-0 translate-y-1.5
                  animate-[fadeIn_0.5s_ease-out_forwards]
                "
                style={{
                  animationDelay: `${i * 0.12}s`,
                }}
              >
                {/* STATUS INDICATOR */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30 blur-sm animate-pulse" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>

                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AMBIENT DEPTH */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_65%)]
          "
        />
      </div>
    </section>
  );
}
