"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass-card ${className}`}
    >
      {children}
    </motion.div>
  );
}
