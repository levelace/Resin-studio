import { cn } from "@/lib/utils";

type Props = {
  /** Extra classes on the outer wrapper (positioning is up to the caller). */
  className?: string;
  /** "hero" renders larger blobs; "panel" renders contained ones for inline sections. */
  variant?: "hero" | "panel";
};

/**
 * Animated resin-pour backdrop — three blurred gradient orbs (gold / orange / pink)
 * drifting behind the content. CSS-only, no JS, respects prefers-reduced-motion.
 * Callers wrap the target section with `relative overflow-hidden` and drop this in.
 */
export function ResinBackdrop({ className, variant = "hero" }: Props) {
  const size = variant === "hero" ? "h-[38rem] w-[38rem]" : "h-80 w-80";
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <div
        className={cn(
          "resin-blob resin-blob-pink animate-float",
          size,
          "-left-32 -top-32",
        )}
      />
      <div
        className={cn(
          "resin-blob resin-blob-gold animate-float-slow",
          size,
          "-right-40 top-10",
        )}
      />
      <div
        className={cn(
          "resin-blob resin-blob-orange animate-float",
          size,
          "bottom-[-12rem] left-1/3",
        )}
        style={{ animationDelay: "-6s" }}
      />
      {/* fine film grain so the gradients read like resin with tiny bubbles */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:3px_3px]" />
    </div>
  );
}
