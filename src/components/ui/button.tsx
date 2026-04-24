import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "shimmer bg-resin-gradient text-primary-foreground shadow-[0_8px_24px_-10px_hsl(var(--resin-pink)/0.7)] hover:brightness-110 hover:shadow-[0_14px_34px_-10px_hsl(var(--resin-pink)/0.8)] active:translate-y-px",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60",
        outline:
          "border border-resin-gold/40 bg-transparent text-foreground hover:bg-resin-gold/10 hover:border-resin-gold/70 hover:text-foreground",
        ghost:
          "text-foreground/90 hover:bg-secondary/80 hover:text-foreground",
        link:
          "text-resin-gold underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };
