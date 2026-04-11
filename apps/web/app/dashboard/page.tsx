import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ContentStudio } from "@/components/studio/content-studio";
import { hasClerkEnv } from "../../lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!hasClerkEnv) {
    return (
      <>
        <main className="content-page-shell dashboard-notice-shell">
        <section className="content-page-card dashboard-notice-card">
          <p className="section-label">App dashboard</p>
          <h1>Dashboard protection is ready for Clerk.</h1>
          <p>
            The first protected app route is scaffolded. Add the Clerk keys from
            <code> apps/web/.env.example </code>
            to activate authentication and route gating. The frontend studio is
            available below for local product work.
          </p>
          <Link className="primary-button" href="/sign-up">
            View auth setup
          </Link>
        </section>
        </main>
        <ContentStudio />
      </>
    );
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <ContentStudio />
  );
}
