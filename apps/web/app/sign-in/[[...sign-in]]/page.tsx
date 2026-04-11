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
      <div className="login-robot-section">
        <div className="login-robot-container" aria-hidden="true">
          {[ 'top', 'mid', 'bot' ].map((pos) => (
            <div key={pos} className={`robot-3d-model robot-${pos}`}>
              <div className="robot-cube">
                <div className="robot-face robot-front">
                  <div className="robot-screen">
                    <div className="robot-eye" />
                    <div className="robot-eye" />
                  </div>
                </div>
                <div className="robot-face robot-back" />
                <div className="robot-face robot-left" />
                <div className="robot-face robot-right" />
                <div className="robot-face robot-top-side" />
                <div className="robot-face robot-bottom-side" />
              </div>
              <div className="robot-smoke-trail" />
            </div>
          ))}
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
