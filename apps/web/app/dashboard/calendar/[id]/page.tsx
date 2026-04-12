import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { getCalendarById, listPostsByCalendar } from "../../../../lib/api";
import { hasClerkEnv } from "../../../../lib/auth";
import { GeneratedCalendarPage } from "../../../../components/studio/generated-calendar-page";

export const dynamic = "force-dynamic";

interface CalendarPageProps {
  params: Promise<{ id: string }>;
}

export default async function CalendarPage({ params }: CalendarPageProps) {
  if (!hasClerkEnv) {
    redirect("/sign-in");
  }

  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const calendar = await getCalendarById(id);
    
    if (!calendar || calendar.userId !== userId) {
      return notFound();
    }

    const posts = await listPostsByCalendar(id);

    return <GeneratedCalendarPage initialData={calendar} initialPosts={posts} />;
  } catch (error) {
    console.error("Error fetching calendar:", error);
    return notFound();
  }
}
