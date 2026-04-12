import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreatePlanSchedule } from "../../../../components/studio/create-plan-schedule";
import { hasClerkEnv } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function CreatePlanSchedulePage() {
  if (!hasClerkEnv) {
    redirect("/sign-in");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <CreatePlanSchedule />;
}
