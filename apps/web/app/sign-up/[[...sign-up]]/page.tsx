import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ConfigurationNotice } from "../../../components/auth/configuration-notice";
import { hasClerkEnv } from "../../../lib/auth";

export default async function SignUpPage() {
  if (!hasClerkEnv) {
    return (
      <ConfigurationNotice
        title="Sign up is scaffolded and waiting for live auth keys."
        description="Once Clerk environment variables are present, this page will turn into the hosted sign-up flow for SrijanAI."
      />
    );
  }

  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="landing-shell auth-page-shell">
      <div className="cosmic-comets" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`comet comet-${i + 1}`} />
        ))}
      </div>
      <section className="auth-shell">
        <SignUp />
      </section>
    </main>
  );
}
