import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "strong";
}

export function GlassCard({ children, className, variant = "default" }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border transition-smooth",
        variant === "default" && "glass",
        variant === "strong" && "glass-strong",
        className
      )}
    >
      {children}
    </div>
  );
}