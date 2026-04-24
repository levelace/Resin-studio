# Testing skill — Dee's Resin Craft & Souvenirs Collection (Resin Studio codebase)

Next.js 14 (App Router) + Tailwind + shadcn + Prisma (SQLite locally) + NextAuth (credentials) + Paystack checkout. Ghana-focused, GHS currency.

## Local bring-up (~30s)

```bash
cp .env.example .env     # if not already present
npm install
npx prisma db push
npm run db:seed          # seeds 8 products, 8 gallery items, 3 courses, 1 demo student
npm run dev              # http://localhost:3000
```

If you hit `Cannot find module './vendor-chunks/*.js'` on a route, the `.next` cache got mangled by an earlier build. Fix: `rm -rf .next && npm run dev`.

## Seeded test accounts / content

- Student: `demo@resinstudio.gh` / `demostudent123` (already enrolled in the free course).
- Free course slug: `starter-guide-free` (checkout returns `{ free: true }`, no Paystack roundtrip).
- Customisable products to exercise the composite-key cart: `custom-tshirt-premium` (GH₵120.00), `aurora-ocean-coasters` (GH₵180.00).

## Useful DB tweaks for testing

`sqlite3` is not installed on the Devin VM — use Prisma from Node instead:

```bash
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.product.update({where:{slug:'custom-tshirt-premium'},data:{stock:1}}).then(r=>{console.log(r.stock);return p.\$disconnect()})"
```

To restore: same one-liner with whatever stock the seed used (e.g. 25 for the T-shirt SKU — check `prisma/seed.ts` for the exact value per SKU).

To clear cart state the cart lives in `localStorage['resin-studio:cart:v1']` — either delete the key in devtools or just trash the line items in the `/cart` UI.

## Flows worth re-testing after a change

1. **Cart composite key** (add same product twice with different customisation text, edit qty on one line, delete the other — the survivor must be unaffected). File: `src/components/cart-store.tsx`.
2. **Stock guard at checkout** (set a product's `stock` to 1 via Prisma, try to check out qty 2+, expect toast `Not enough stock for "<title>" — only N left` and no navigation). File: `src/app/api/checkout/route.ts`.
3. **Free-course enrolment** (register → `/courses/starter-guide-free` → Enrol → land on `/dashboard/course/starter-guide-free` with PDF download link). Doesn't need Paystack.
4. **Gated PDF negative control** (`curl -i http://localhost:3000/api/downloads/<id>` with no cookies → expect exactly `401 Login required`).

## Not testable without secrets

- **Paystack paid checkout** needs `PAYSTACK_SECRET_KEY` + `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` in `.env`. Without them, `/api/checkout` will still validate stock and return 409 on overshoot, but happy-path paid flows are blocked.
- **Paystack webhook idempotency** needs a Paystack test-mode source pointed at `/api/paystack/webhook`. Idempotent `fulfillOrder()` is in `src/lib/fulfill-order.ts`.

## Devin Secrets Needed

- `PAYSTACK_SECRET_KEY` — only required if you're exercising the paid checkout or webhook flows.
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` — paired with above.

Neither secret is needed for the cart/stock/theme tests in section above.

## Gotchas

- **`.env` overrides siteConfig defaults**: `NEXT_PUBLIC_SITE_NAME` in `.env` takes precedence over the hardcoded default in `src/lib/utils.ts`. After a rebrand or name change, the `.env` file may still have the old name (since `.env` is gitignored and not overwritten by maintenance). Always check `.env` matches `.env.example` when testing branding changes — update or delete `.env` and restart the dev server.
- **Port conflicts**: If port 3000 is already in use, Next.js auto-falls back to 3001. Check the dev server output for the actual URL.
- **Auth cookie prefix**: NextAuth is configured to use `next-auth.session-token` in dev (non-`__Secure-`). If you change this and run on `http://localhost`, browsers will silently drop the cookie and registrations will "succeed" but not log the user in. See `src/app/api/auth/[...nextauth]/route.ts`.
- **Downlevel iteration**: the repo's `tsconfig` doesn't enable `downlevelIteration`, so `[...new Set(...)]` won't typecheck — use `Array.from(new Set(...))` instead.
- **Stock UI**: out-of-stock check is `product.stock <= 0`, not `=== 0`. If you ever force-negative stock for testing, the UI still correctly hides the CTA.
