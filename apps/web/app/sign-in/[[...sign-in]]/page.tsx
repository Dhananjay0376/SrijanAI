import { SignIn } from "@clerk/nextjs";
import { ConfigurationNotice } from "../../../components/auth/configuration-notice";
import { hasClerkEnv } from "../../../lib/auth";

export default function SignInPage() {
  if (!hasClerkEnv) {
    return (
      <ConfigurationNotice
        title="Sign in will be enabled as soon as Clerk keys are added."
        description="The auth routes are scaffolded and ready. Add the Clerk environment variables from apps/web/.env.example to activate hosted sign-in."
      />
    );
  }

  return (
    <section className="auth-shell">
      <SignIn />
    </section>
  );
}
