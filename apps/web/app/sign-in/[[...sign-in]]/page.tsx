import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ConfigurationNotice } from "../../../components/auth/configuration-notice";
import { hasClerkEnv } from "../../../lib/auth";

export default async function SignInPage() {
  if (!hasClerkEnv) {
    return (
      <ConfigurationNotice
        title="Sign in will be enabled as soon as Clerk keys are added."
        description="The auth routes are scaffolded and ready. Add the Clerk environment variables from apps/web/.env.example to activate hosted sign-in."
      />
    );
  }

  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="landing-shell login-page-shell">
      <div className="cosmic-comets" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`comet comet-${i + 1}`} />
        ))}
      </div>
      <section className="login-shell">
      <div className="login-copy">
        <p className="section-label">Creator workspace</p>
        <h1>Sign in and pick up the next content sprint.</h1>
        <p>
          Keep your calendar, hooks, scripts, and platform ideas in one calm
          workspace built for consistent publishing.
        </p>
        <div className="login-proof-list" aria-label="Workspace highlights">
          <span>Monthly plans</span>
          <span>Platform drafts</span>
          <span>Creator rhythm</span>
        </div>
      </div>

      <div className="login-panel" aria-label="Sign in form">
        <SignIn
          appearance={{
            elements: {
              rootBox: "clerk-login-root",
              card: "clerk-login-card",
              headerTitle: "clerk-login-title",
              headerSubtitle: "clerk-login-subtitle",
              formButtonPrimary: "clerk-login-primary",
              footerActionLink: "clerk-login-link",
            },
          }}
        />
        <p className="login-switch">
          New to SrijanAI? <Link href="/sign-up">Create an account</Link>
        </p>
      </div>
      </section>
    </main>
  );
}
