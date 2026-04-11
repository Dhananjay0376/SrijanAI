import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { hasClerkEnv } from "../../lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!hasClerkEnv) {
    return (
      <main className="content-page-shell">
        <section className="content-page-card">
          <p className="section-label">App dashboard</p>
          <h1>Dashboard protection is ready for Clerk.</h1>
          <p>
            The first protected app route is scaffolded. Add the Clerk keys from
            <code> apps/web/.env.example </code>
            to activate authentication and route gating.
          </p>
          <Link className="primary-button" href="/sign-up">
            View auth setup
          </Link>
        </section>
      </main>
    );
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="content-page-shell">
      <section className="content-page-card">
        <p className="section-label">Dashboard</p>
        <h1>Welcome to the future SrijanAI workspace.</h1>
        <p>
          This protected route will become the creator dashboard for onboarding,
          monthly calendar generation, content review, exports, and scheduling.
        </p>
      </section>
    </main>
  );
}
