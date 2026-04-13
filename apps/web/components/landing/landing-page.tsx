"use client";

import { ArrowRight } from "lucide-react";
import { NeonButton } from "../ui/NeonButton";
import { AnimatedBackground } from "./animated-background";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { hasClerkPublishableKey } from "../../lib/auth";

export default function LandingPage() {
  const { isSignedIn: clerkIsSignedIn } = useAuth();
  const isSignedIn = hasClerkPublishableKey ? clerkIsSignedIn : false;

  return (
    <main className="landing-shell">
      <AnimatedBackground />
      <section className="landing-hero" aria-labelledby="landing-title">
        <motion.div 
          className="landing-hero-copy"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.p 
            className="landing-kicker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            AI × CONTENT × INDIA
          </motion.p>
          <motion.h1 
            id="landing-title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 100 }}
          >
            Your Content.
            <br />
            Every Month.
            <br />
            <span className="landing-hero-accent">Automated.</span>
          </motion.h1>
          <motion.p 
            className="landing-hero-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            India ka pehla AI Content Planner — Hindi, English aur Hinglish mein
            Instagram, YouTube aur LinkedIn ke liye posts automatically
            generate karta hai.
          </motion.p>
          <motion.div 
            className="landing-actions" 
            aria-label="Primary actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <NeonButton href={isSignedIn ? "/dashboard" : "/sign-up"}>
              Start for Free <ArrowRight size={18} />
            </NeonButton>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
