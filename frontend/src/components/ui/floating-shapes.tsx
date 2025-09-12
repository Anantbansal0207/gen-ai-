"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingShapeProps {
  className?: string;
  delay?: number;
  duration?: number;
}

export function FloatingShape({ className, delay = 0, duration = 6 }: FloatingShapeProps) {
  return (
    <motion.div
      className={cn(
        "absolute rounded-full opacity-20",
        className
      )}
      animate={{
        y: [-20, 20, -20],
        x: [-10, 10, -10],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <FloatingShape 
        className="w-64 h-64 bg-gradient-serenity top-10 -left-32 organic-border"
        delay={0}
        duration={8}
      />
      <FloatingShape 
        className="w-48 h-48 bg-gradient-peaceful top-1/3 -right-24 organic-border-alt"
        delay={2}
        duration={10}
      />
      <FloatingShape 
        className="w-72 h-72 bg-gradient-warm -bottom-36 left-1/4 organic-border"
        delay={4}
        duration={12}
      />
      <FloatingShape 
        className="w-56 h-56 bg-gradient-calm bottom-20 -right-28 organic-border-alt"
        delay={1}
        duration={9}
      />
    </div>
  );
}