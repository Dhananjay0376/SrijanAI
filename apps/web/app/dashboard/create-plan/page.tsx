import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ContentStudio } from "../../../components/studio/content-studio";
import { hasClerkEnv } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function CreatePlanPage() {
  if (!hasClerkEnv) {
    redirect("/sign-in");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <ContentStudio />;
}
