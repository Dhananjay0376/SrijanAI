import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/guide", label: "Guide" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-title">SrijanAI</p>
        <p className="footer-copy">
          Building a faster, calmer content workflow for creators who want
          structure without losing their voice.
        </p>
      </div>

      <div className="footer-links">
        {footerLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}

