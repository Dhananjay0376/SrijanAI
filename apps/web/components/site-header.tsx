import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { hasClerkPublishableKey } from "../lib/auth";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/guide", label: "Guide" },
  { href: "/dashboard", label: "App" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand-mark" href="/">
        <span className="brand-kicker">SrijanAI</span>
        <span className="brand-subtitle">Creator workflow engine</span>
      </Link>

      <nav className="site-nav" aria-label="Primary">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="site-actions">
        {hasClerkPublishableKey ? (
          <>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="nav-link-button" type="button">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="nav-primary-button" type="button">
                  Start free
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <div className="user-button-shell">
                <UserButton />
              </div>
            </Show>
          </>
        ) : (
          <>
            <Link className="nav-link-button" href="/sign-in">
              Sign in
            </Link>
            <Link className="nav-primary-button" href="/sign-up">
              Start free
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
