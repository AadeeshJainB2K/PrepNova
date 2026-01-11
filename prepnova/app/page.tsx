import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TechParticleSection } from "@/components/landing/TechParticleSection";
import { SystemStatusSection } from "@/components/landing/SystemStatusSection";
import { auth } from "@/auth";
export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await auth();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header session={session} />
      <HeroSection />
      <TechParticleSection />
      <SystemStatusSection />
    </div>
  );
}
