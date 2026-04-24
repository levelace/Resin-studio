# Re-test plan — PR #1 after auth cookie fix

Repo: `levelace/Resin-studio` · PR: https://github.com/levelace/Resin-studio/pull/1
Branch: `devin/1777052576-initial-scaffold`
Target: local dev (`npm run dev`, http://localhost:3000)

## Context — what I already verified in round 1

These passed already and **will not be repeated** in the recording:

- Home page SSR: hero + 5 categories + **4** featured products + **6** gallery tiles, all from the seed
- Shop filter: `/shop` shows **8** tiles; `/shop?category=candle` narrows to **2**
- Product detail: `/shop/aurora-ocean-coasters` renders price, qty, customization field
- Add-to-cart: toast `"Added 1 × Aurora ocean resin coasters (set of 4) to cart"` + header badge = `1`
- Cart page: one line, subtotal `GH₵180.00`

## What broke + what I fixed

- **Bug**: `src/lib/auth.ts` hard-coded the session cookie name to `__Secure-next-auth.session-token`. The `__Secure-` prefix requires `secure=true`, which requires HTTPS. On local HTTP the browser silently dropped the cookie, so `/register` and `/login` flashed success toasts but left the user unauthenticated (middleware kept redirecting back to `/login`).
- **Fix** (commit `cdb753a`): use `next-auth.session-token` when `NODE_ENV !== "production"`, keep `__Secure-next-auth.session-token` in prod. Matches the default `getToken()` cookie-name resolution that `withAuth` middleware uses when `NEXTAUTH_URL` starts with `http://`.
- **Verified at the HTTP layer**: `GET /api/auth/csrf` now returns `set-cookie: next-auth.csrf-token=...` (no `__Secure-` prefix) with `HttpOnly; SameSite=Lax`.

## Re-test — one primary flow, one negative

### Test A — Register → auto-login → dashboard (proves the fix)
1. Navigate to `/register`.
2. Fill: `name=Test Student`, `email=student+<timestamp>@example.com`, `password=test-password-1234`. Submit.

**Assertions (all must hold):**
- Toast `"Welcome to the studio!"` appears.
- URL changes to **`/dashboard`** within ~2 s (NOT `/login?callbackUrl=...`).
- `/dashboard` renders the heading `"Welcome, Test"` (first name), and the "My courses" empty-state text `"You're not enrolled in any courses yet."`
- Header right side now shows `"My area"` and `"Sign out"` (instead of `Log in` / `Join students`).
- DevTools Application → Cookies shows a `next-auth.session-token` cookie (not `__Secure-...`) with `HttpOnly` + `SameSite=Lax`.

**Why this distinguishes working vs broken**: before the fix, step 3 landed on `/login?callbackUrl=%2Fdashboard` because the session cookie was dropped. After the fix, the session cookie persists → middleware admits the user → `/dashboard` renders.

### Test B — Free-course enrol + gated content (proves the students area works end-to-end)
1. From the dashboard, open `/courses/starter-guide-free`. Click the `"Enroll for free"` button.

**Assertions:**
- `POST /api/checkout` returns JSON `{"free": true}` (captured from devtools network tab or inferred from the subsequent navigation).
- Page navigates to `/dashboard/course/starter-guide-free`.
- Toast `"Enrolled!"` appears.
- Course page shows heading `"Starter Guide — free PDF & intro video"` and a lesson list with at least one `"Download PDF guide"` button linking to `/api/downloads/<id>`.
- Going back to `/dashboard` now shows one course tile titled `"Starter Guide — free PDF & intro video"` under "My courses" (no longer empty-state).

**Why this distinguishes**: a broken checkout endpoint would error-toast ("Could not start checkout") and stay on the course page. A broken enrollment upsert would let the user onto `/dashboard/course/...` but the returning `/dashboard` would still be empty.

### Test C — Negative: gated PDF returns `401` without a session
Run from a fresh `curl` (no cookies). The lesson id is captured from the DOM of the course page in Test B.

```
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/downloads/<lessonId>
```

**Assertion**: status is exactly `401`. A follow-up `curl -s http://localhost:3000/api/downloads/<lessonId>` should print JSON body `{"error":"Login required"}`.

**Why this distinguishes**: anything other than `401` (200 with the PDF, 302 redirect, 500) means the gating is broken.

## Exit criteria

Tests A + B + C all pass. If A fails the fix didn't stick → back to code. If B fails the free-course branch is broken. If C fails the gating is broken.

## Not testing

- Paid Paystack flow (no test keys provided).
- Google OAuth / email magic-links (optional, only active with env vars).
- Mobile viewport (header uses `md:` breakpoints — already verified layout is mobile-first via CSS review, not reproducing in the recording).
