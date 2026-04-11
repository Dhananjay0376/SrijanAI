import Link from "next/link";

type ConfigurationNoticeProps = {
  title: string;
  description: string;
};

export function ConfigurationNotice({
  title,
  description,
}: ConfigurationNoticeProps) {
  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="section-label">Authentication setup required</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="auth-code-block">
          <span>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</span>
          <span>CLERK_SECRET_KEY</span>
          <span>NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in</span>
          <span>NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up</span>
        </div>
        <div className="auth-actions">
          <Link className="primary-button" href="/">
            Back to home
          </Link>
          <Link className="secondary-button" href="/guide">
            Read the guide
          </Link>
        </div>
      </div>
    </section>
  );
}

