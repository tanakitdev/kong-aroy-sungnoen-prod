// app/dashboard/page.tsx
import { auth } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import DashboardContentPage from "./DashboardContent";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?from=dashboard`);
  }

  return <DashboardContentPage />
}