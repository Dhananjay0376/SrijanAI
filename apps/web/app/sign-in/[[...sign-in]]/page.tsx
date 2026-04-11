import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
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
    <section className="auth-shell">
      <SignIn />
    </section>
  );
}
