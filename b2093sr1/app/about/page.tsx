import AboutWorkflowCanvas from "@/components/landing/AboutWorkflowCanvas";
export default function AboutPage() {
  return (
    <section className="min-h-screen bg-black text-white pt-40 pb-32">
      <div className="max-w-6xl mx-auto px-6 space-y-20">

        {/* PAGE TITLE */}
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight">
            About HackBoiler
          </h1>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
            A production-grade system designed to remove friction from building,
            experimenting, and shipping ideas at hackathon speed.
          </p>
        </div>

        {/* PRODUCT OVERVIEW PANEL */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10">
          <h2 className="text-xl font-medium mb-6">System Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="rounded-xl border border-white/10 p-6">
              <p className="text-neutral-400 mb-2">Core</p>
              <p>Next.js • Auth • Database • AI</p>
            </div>

            <div className="rounded-xl border border-white/10 p-6">
              <p className="text-neutral-400 mb-2">Purpose</p>
              <p>Ship faster. Reduce setup friction.</p>
            </div>

            <div className="rounded-xl border border-white/10 p-6">
              <p className="text-neutral-400 mb-2">State</p>
              <p className="text-emerald-400">Production Ready</p>
            </div>
          </div>
        </div>

        {/* CAPABILITIES – AUTOMATION STYLE */}
        <div>
          <h2 className="text-xl font-medium mb-8">Capabilities</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {[
              {
                title: "Authentication",
                desc: "Secure auth flows pre-wired with session handling.",
              },
              {
                title: "AI Actions",
                desc: "Composable AI helpers designed for rapid experimentation.",
              },
              {
                title: "Data Layer",
                desc: "Typed database schema with predictable migrations.",
              },
              {
                title: "UI System",
                desc: "Consistent, dark-first UI primitives and layouts.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="mb-2 font-medium">{item.title}</p>
                <p className="text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM SECTION */}
        <div>
          <h2 className="text-xl font-medium mb-8">Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            {[
              {
                name: "Core Developer",
                role: "System Architecture & Frontend",
              },
              {
                name: "AI Engineer",
                role: "AI Logic & Automation",
              },
              {
                name: "Product Designer",
                role: "UX, UI & Experience",
              },
            ].map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="font-medium">{member.name}</p>
                <p className="text-neutral-400 mt-1">{member.role}</p>
              </div>
            ))}
            
          </div>
        </div>
        <main className="bg-black text-white min-h-screen pt-40">
          <div className="text-center mb-20">
            <h1 className="text-5xl font-semibold">About HackBoiler</h1>
            <p className="mt-4 text-neutral-400">
              System-level view of the product and team.
            </p>
          </div>

          <AboutWorkflowCanvas />
        </main>
      </div>
    </section>

    
  );
}

 