import { SchedulerSidebar } from "@/components/scheduler/SchedulerSidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SchedulerPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  return <SchedulerSidebar />;
}
