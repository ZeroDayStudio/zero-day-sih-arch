"use client";

import { motion } from "framer-motion";

export const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return <motion.div className={className} variants={reveal} initial="hidden" animate="show" transition={{ delay }}>{children}</motion.div>;
}

export function Stagger({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>{children}</motion.div>;
}