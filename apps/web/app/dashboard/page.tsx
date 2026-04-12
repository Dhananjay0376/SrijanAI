import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { DashboardHome } from "../../components/studio/dashboard-home";
import { hasClerkEnv } from "../../lib/auth";
import { getCalendarsByUser } from "../../lib/api";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!hasClerkEnv) {
    redirect("/sign-in");
  }

  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  const calendars = await getCalendarsByUser(userId);
  
  return <DashboardHome firstName={user?.firstName} initialCalendars={calendars} />;
}
