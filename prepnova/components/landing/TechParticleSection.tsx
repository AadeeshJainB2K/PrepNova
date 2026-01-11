"use client";

import Image from "next/image";


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
              <div
                key={tech.name}
                className="flex flex-col items-center gap-3 animate-[float_8s_ease-in-out_infinite]"
                style={{
                  animationDelay: `${i * 0.3}s`,
                }}
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
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
