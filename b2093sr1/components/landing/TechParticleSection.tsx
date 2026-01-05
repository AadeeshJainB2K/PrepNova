"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const techStack = [
  { name: "Next.js", icon: "nextjs", color: true },
  { name: "React", icon: "react", color: true },
  { name: "TypeScript", icon: "typescript", color: true },
  { name: "Node.js", icon: "nodejs", color: true },
  { name: "PostgreSQL", icon: "postgresql", color: true },
  { name: "MongoDB", icon: "mongodb", color: true },
  { name: "Python", icon: "python", color: true },
  { name: "Docker", icon: "docker", color: true },
];

function floatSlow(delay = 0) {
  return {
    y: [0, -10, 0],
    transition: {
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };
}

export function TechParticleSection() {
  return (
    <section className="relative bg-black py-32">
      <div className="max-w-6xl mx-auto px-6">

        {/* GLASS CONTAINER */}
        <div
          className="
            relative
            rounded-3xl
            border border-white/10
            bg-white/[0.03]
            backdrop-blur-xl
            px-16 py-20
          "
        >
          {/* ICON GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-16 gap-y-14 place-items-center">

            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                animate={floatSlow(i * 0.3)}
                className="flex flex-col items-center gap-3"
              >
                <Image
                  src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon}/${tech.icon}-original.svg`}
                  alt={tech.name}
                  width={48}
                  height={48}
                />
                <span className="text-xs text-neutral-400">
                  {tech.name}
                </span>
              </motion.div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
