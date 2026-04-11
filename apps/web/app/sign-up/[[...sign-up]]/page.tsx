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
    <section className="auth-shell">
      <SignUp />
    </section>
  );
}
