# Resin Studio

Modern, SEO-optimised web app for a Ghana-based resin artist — storefront (resin art,
gift packaging, custom T-shirts, mugs, scented candles), gallery, contact, plus a
**students area** with gated video lessons and downloadable PDF guides.

## Tech stack

- **Next.js 14 (App Router) + TypeScript + Tailwind CSS** — SSR/SSG for SEO,
  React Server Components, image optimisation out of the box.
- **Prisma** ORM with **SQLite** locally (production-ready swap to Postgres by
  changing `provider` + `DATABASE_URL`).
- **NextAuth v4** for auth — email + password (credentials), Google OAuth, and
  email magic links (all optional; configure via env).
- **Paystack** for checkout and course enrolment — supports **Visa/Mastercard and
  Mobile Money (MTN MoMo, Telecel Cash, AirtelTigo Money)** in **GHS**. Webhook
  is HMAC-verified.
- **shadcn-style UI primitives** built on Radix + class-variance-authority.
- **SEO**: metadata API, dynamic OpenGraph, `sitemap.xml`, `robots.txt`, JSON-LD
  (`LocalBusiness`, `Product`, `Course`), mobile-first layouts.
- **Security headers**: strict CSP, HSTS, X-Frame-Options `DENY`, Referrer-Policy,
  Permissions-Policy, signed cookies for sessions, in-memory rate limiting on
  register/contact/checkout, bcrypt password hashing (cost 12).

## Project layout

```
src/
├── app/
│   ├── (public routes)    home, shop, gallery, courses, about, contact
│   ├── login, register    auth screens
│   ├── cart, checkout     cart page + Paystack success
│   ├── dashboard          gated student dashboard (+ per-course player)
│   ├── api/               /register /contact /checkout /paystack/webhook /downloads
│   ├── sitemap.ts, robots.ts
│   └── layout.tsx
├── components/            UI primitives, header, footer, cart store
├── lib/                   prisma, auth, paystack, utils, rate-limit
└── middleware.ts          protects /dashboard/*
prisma/
├── schema.prisma
└── seed.ts                demo products, gallery, courses
```

## Quick start

```bash
cp .env.example .env                     # edit values
npm install
npx prisma db push                       # creates SQLite DB
npm run db:seed                          # loads demo content
npm run dev                              # http://localhost:3000
```

Demo student account (after seed):
`demo@resinstudio.gh` / `demostudent123`

Add your own email to `ADMIN_EMAILS` in `.env` to get the `admin` role on login.

## Paystack setup

1. Create an account at https://dashboard.paystack.com (Ghana).
2. Copy **TEST** keys into `.env`:
   - `PAYSTACK_SECRET_KEY=sk_test_…`
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_…`
3. Register the webhook URL:
   `https://YOUR_DOMAIN/api/paystack/webhook`
4. Test cards: https://paystack.com/docs/payments/test-payments
   Test MoMo: any Ghana phone number in test mode returns success.
5. Switch to LIVE keys only after KYC is complete and test orders pass.

## Going to production

- Switch Prisma to Postgres (Neon / Supabase / Railway): update `schema.prisma`
  `provider = "postgresql"` and `DATABASE_URL`, then `prisma migrate deploy`.
- Deploy to **Vercel** (auto-detects Next.js). Add all env vars in Vercel
  dashboard. The Paystack webhook must hit your production URL.
- Swap video delivery to **Mux** (or Cloudflare Stream / Bunny) and replace the
  `<video>` tag in `dashboard/course/[slug]/page.tsx` with `<MuxPlayer>`.
- Move gated PDFs out of `/public` and into S3/R2 with a signed-URL helper in
  `api/downloads/[id]/route.ts`.
- Swap the in-memory rate limiter for Upstash Redis for multi-instance deploys.

## Security notes

- Passwords: bcrypt cost 12. Never log plaintext.
- Session cookies: `__Secure-` prefix + `httpOnly` + `sameSite=lax`.
- Paystack webhook: HMAC-SHA512 signature verification with timing-safe compare.
- CSP locked to self + Paystack + known image CDNs; no inline `eval` in prod.
- `/dashboard/*` gated via `withAuth` middleware.
- PDF downloads gated server-side by active enrollment.

## License

Proprietary — all rights reserved.
