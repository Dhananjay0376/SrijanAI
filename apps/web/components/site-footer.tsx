import Link from "next/link";

const productLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/guide", label: "How It Works" },
  { href: "/sign-up", label: "Get Started" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
];

const socialLinks = [
  { href: "https://github.com/Dhananjay0376/SrijanAI", label: "GH", title: "GitHub" },
  { href: "https://twitter.com", label: "𝕏", title: "Twitter / X" },
  { href: "https://linkedin.com", label: "in", title: "LinkedIn" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <p className="footer-title">SrijanAI</p>
            <p className="footer-copy">
              Building a faster, calmer content workflow for creators who want
              structure without losing their voice.
            </p>
          </div>

          <div>
            <p className="footer-col-title">Product</p>
            <div className="footer-col-links">
              {productLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="footer-col-title">Company</p>
            <div className="footer-col-links">
              {companyLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="footer-col-title">Connect</p>
            <div className="footer-col-links">
              {socialLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-legal">
            © {new Date().getFullYear()} SrijanAI. All rights reserved.
          </span>
          <div className="footer-socials">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
                title={link.title}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
