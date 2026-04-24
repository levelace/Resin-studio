"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, ShoppingBag, User2, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn, siteConfig } from "@/lib/utils";
import { useCartCount } from "./cart-store";

const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const cartCount = useCartCount();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-2 font-display text-xl font-semibold tracking-tight"
        >
          <span className="relative inline-block h-9 w-9 rounded-full bg-resin-gradient shadow-[0_0_20px_-4px_hsl(var(--resin-gold)/0.7)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
            <span className="absolute inset-[3px] rounded-full bg-background/30 mix-blend-overlay" />
          </span>
          <span className="text-sm sm:text-xl truncate max-w-[180px] sm:max-w-none">{siteConfig.name}</span>
        </Link>

        <nav className="hidden gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-resin-gradient after:transition-all after:duration-300 hover:after:w-full",
                pathname === item.href && "text-foreground after:w-full",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative" aria-label="Cart">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-resin-gradient px-1 text-[10px] font-bold text-primary-foreground shadow-[0_0_12px_-2px_hsl(var(--resin-gold)/0.9)] animate-glow-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {status === "authenticated" ? (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard"><User2 className="mr-1.5 h-4 w-4" />My area</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="mr-1.5 h-4 w-4" />Sign out
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost" size="sm"><Link href="/login">Log in</Link></Button>
              <Button asChild size="sm"><Link href="/register">Join students</Link></Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="container flex flex-col gap-1 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 px-3">
              {session ? (
                <>
                  <Button asChild className="flex-1"><Link href="/dashboard" onClick={() => setOpen(false)}>My area</Link></Button>
                  <Button variant="outline" className="flex-1" onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}>Sign out</Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="flex-1"><Link href="/login" onClick={() => setOpen(false)}>Log in</Link></Button>
                  <Button asChild className="flex-1"><Link href="/register" onClick={() => setOpen(false)}>Join</Link></Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
