import Link from "next/link";
import { Instagram, Mail, Phone } from "lucide-react";
import { siteConfig } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border/60 bg-background/50 backdrop-blur">
      <div aria-hidden className="resin-divider absolute inset-x-0 top-0" />
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
            <span className="inline-block h-7 w-7 rounded-full bg-resin-gradient shadow-[0_0_14px_-4px_hsl(var(--resin-gold)/0.8)]" />
            <span className="text-resin">{siteConfig.name}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Handcrafted resin art and thoughtful gift packaging, made in Ghana. Custom prints, scented candles,
            and online resin courses.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/shop?category=resin" className="hover:text-foreground">Resin art</Link></li>
            <li><Link href="/shop?category=gift-box" className="hover:text-foreground">Gift boxes &amp; bags</Link></li>
            <li><Link href="/shop?category=tshirt" className="hover:text-foreground">Custom T-shirts</Link></li>
            <li><Link href="/shop?category=mug" className="hover:text-foreground">Mugs</Link></li>
            <li><Link href="/shop?category=candle" className="hover:text-foreground">Scented candles</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Learn</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/courses" className="hover:text-foreground">Resin courses</Link></li>
            <li><Link href="/register" className="hover:text-foreground">Join as a student</Link></li>
            <li><Link href="/dashboard" className="hover:text-foreground">Student dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@resinstudio.gh</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +233 20 000 0000</li>
            <li className="flex items-center gap-2"><Instagram className="h-4 w-4" /> @resinstudio</li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Accra, Ghana • Delivery nationwide • Pay with card or Mobile Money (MTN MoMo, Telecel Cash, AirtelTigo Money)
          </p>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
