import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { GeneratedCalendarPage } from "../../../../components/studio/generated-calendar-page";
import { hasClerkEnv } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function CreatePlanGeneratedPage() {
  if (!hasClerkEnv) {
    redirect("/sign-in");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <GeneratedCalendarPage />;
}
