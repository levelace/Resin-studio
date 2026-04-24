import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "outline" }) {
  const styles = {
    default: "bg-resin-gold/10 text-resin-gold border-resin-gold/30",
    secondary: "bg-secondary text-secondary-foreground border-border/80",
    outline: "bg-background/40 border-border/80 text-foreground backdrop-blur",
  }[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        styles,
        className,
      )}
      {...props}
    />
  );
}
