import Link from "next/link";
import { Instagram, Mail, Phone, MessageCircle } from "lucide-react";
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
            Handcrafted resin art, souvenirs, and thoughtful gift packaging, made in Kumasi, Ghana. Custom prints, scented candles,
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
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@deesresincraft.gh</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +233 24 398 1613</li>
            <li className="flex items-center gap-2"><Instagram className="h-4 w-4" /> @deesresincraft</li>
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://wa.me/233243981613"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366] text-white transition-transform hover:scale-110"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href="https://www.tiktok.com/@deesresincraft"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-transform hover:scale-110"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 005.58 2.19V12a4.85 4.85 0 01-3.59-1.57 4.83 4.83 0 01-1.22-3.07h3.45V6.69h1.36z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/deesresincraft"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] text-white transition-transform hover:scale-110"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Manhiya Palace Museum, Kumasi, Ghana • Delivery nationwide • Pay with card or Mobile Money (MTN MoMo, Telecel Cash, AirtelTigo Money)
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
