"use client";

import {
  Show,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { hasClerkPublishableKey } from "../lib/auth";
import { motion } from "framer-motion";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/guide", label: "Guide" },
  { href: "/dashboard", label: "App" },
];

export function SiteHeader() {
  return (
    <motion.div 
      className="site-header-wrap"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <header className="site-header">
        <Link className="brand-mark" href="/">
          <motion.div 
            className="brand-icon"
            whileHover={{ scale: 1.1, rotate: 5, boxShadow: "0 0 15px rgba(2, 156, 193, 0.5)" }}
          >
            S
          </motion.div>
          <div className="brand-text">
            <span className="brand-kicker">SrijanAI</span>
            <span className="brand-subtitle">Creator workflow engine</span>
          </div>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {navigationItems.map((item, i) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, color: "#029cc1", textShadow: "0 0 8px rgba(2, 156, 193, 0.5)" }}
              >
                {item.label}
              </motion.div>
            </Link>
          ))}
        </nav>

        <motion.div 
          className="site-actions"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {hasClerkPublishableKey ? (
            <>
              <Show when="signed-out">
                <Link className="nav-link-button" href="/sign-in">
                  Sign in
                </Link>
                <Link className="nav-primary-button" href="/sign-up">
                  Start free
                </Link>
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
        </motion.div>
      </header>
    </motion.div>
  );
}
