"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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
    <motion.footer 
      className="site-footer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="footer-inner">
        <div className="footer-grid">
          <motion.div 
            className="footer-brand-col"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="footer-title">SrijanAI</p>
            <p className="footer-copy">
              Building a faster, calmer content workflow for creators who want
              structure without losing their voice.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="footer-col-title">Product</p>
            <div className="footer-col-links">
              {productLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.span whileHover={{ color: "#029cc1", x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    {link.label}
                  </motion.span>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p className="footer-col-title">Company</p>
            <div className="footer-col-links">
              {companyLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.span whileHover={{ color: "#029cc1", x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    {link.label}
                  </motion.span>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="footer-col-title">Connect</p>
            <div className="footer-col-links">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ color: "#029cc1", x: 5 }} 
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {link.title}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span className="footer-legal">
            © {new Date().getFullYear()} SrijanAI. All rights reserved.
          </span>
          <div className="footer-socials">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
                title={link.title}
                whileHover={{ scale: 1.2, color: "#029cc1", filter: "drop-shadow(0 0 8px rgba(2, 156, 193, 0.6))" }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
