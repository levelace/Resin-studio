# Test report — PR #1 (Resin Studio initial scaffold)

**PR**: https://github.com/levelace/Resin-studio/pull/1
**Devin session**: https://app.devin.ai/sessions/bf616fe02ddb4f81961ab63455cecae5
**Recording**: https://app.devin.ai/attachments/29a9a266-67b7-487e-93a0-25fc1dbb0796/rec-a08be828-5d60-4ef7-9068-3bcb8c7126e8-subtitled.mp4

## TL;DR

- Found and fixed one real bug while testing (auth cookie prefix).
- All planned tests now pass on the fixed build.
- Paid Paystack flow was **not** tested — no test keys provided; by design, the storefront would 500 on `/api/checkout` until a `PAYSTACK_SECRET_KEY` is added to `.env`.

## Results at a glance

| # | Test | Result |
|---|---|---|
| 1 | Home page renders seeded content (5 categories, 4 featured, 6 gallery) | ✅ passed (round 1) |
| 2 | `/shop?category=candle` filters to exactly 2 tiles | ✅ passed (round 1) |
| 3 | Add-to-cart → toast + badge + cart page with `GH₵180.00` subtotal | ✅ passed (round 1) |
| 4 | Register → auto-login → `/dashboard` with "Welcome, Test" | ✅ passed (round 2, after fix) |
| 5 | Enrol in free course → `/dashboard/course/…` + course tile on `/dashboard` | ✅ passed (round 2) |
| 6 | Gated PDF returns `401 {"error":"Login required"}` without a session | ✅ passed (round 2) |
| 7 | Paid Paystack checkout | ⏭ skipped — no test keys |

## Escalation — bug fixed mid-run

**Symptom (round 1)**: after `/register`, the browser flashed `"Welcome to the studio!"` then bounced to `/login?callbackUrl=%2Fdashboard`. Login from that page also showed a `"Logged in"` toast but never redirected. The cart badge stayed at `1` (localStorage) but the header still read `Log in` / `Join students` — i.e. no session.

![Round 1 — stuck on /login after "Logged in" toast](https://app.devin.ai/attachments/a73fa8f9-c593-44e8-8b15-9c3e252f8ef3/screenshot_00955151fcdd44ffa25df86f5144880c.png)

**Root cause**: `src/lib/auth.ts` hard-coded the session cookie name to `__Secure-next-auth.session-token`. Chrome/Firefox reject any cookie starting with `__Secure-` unless the `Secure` attribute is true, which requires HTTPS. In dev (`http://localhost:3000`) `secure` was `false`, so every auth response's `Set-Cookie` was silently dropped.

**Fix** (commit [`cdb753a`](https://github.com/levelace/Resin-studio/commit/cdb753a)):

```ts
const isProd = process.env.NODE_ENV === "production";
...
sessionToken: {
  name: isProd
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token",
  options: { httpOnly: true, sameSite: "lax", path: "/", secure: isProd },
},
```

This matches the default cookie name that `withAuth` middleware's `getToken()` looks for when `NEXTAUTH_URL` uses `http://`. Verified at the HTTP layer: `GET /api/auth/csrf` now returns `set-cookie: next-auth.csrf-token=...; HttpOnly; SameSite=Lax` without the `__Secure-` prefix.

## Evidence (round 2 — after fix)

### Test 4 — Register → `/dashboard`

After submitting the register form, the page lands on `/dashboard`, heading reads `Welcome, Test`, header right-side switches from `Log in` / `Join students` to `My area` / `Sign out`.

![/dashboard after register — session persisted](https://app.devin.ai/attachments/14af3f50-583a-4c6f-84ce-08ed9538c397/screenshot_21fde4544eec4882897aaafae18755b2.png)

### Test 5 — Enrol in free course → gated course page

Clicking `Enroll for free` on `/courses/starter-guide-free` posts to `/api/checkout`, and since `priceMinor === 0` the handler short-circuits Paystack and upserts the Enrollment directly. The client then navigates to `/dashboard/course/starter-guide-free`; toast reads `Enrolled!`; Lesson 2 exposes a `Download PDF guide` link to `/api/downloads/cmod7660y000vfn8rvs3gsv4s`.

![Enrolled course page with Download PDF guide](https://app.devin.ai/attachments/ea7d929c-197a-4aed-bd06-2bfaf19f08a5/screenshot_3230f2aa5bbf49fdade5a3864b179009.png)

Returning to `/dashboard` now shows the enrolled course tile in place of the empty-state:

![/dashboard now shows the enrolled course tile](https://app.devin.ai/attachments/183ac965-274c-4e90-a7e1-a789d18cbc08/screenshot_79f4fe1d21a74197965317aa34f94dc1.png)

### Test 6 — Gated PDF, no session

```
$ curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/downloads/cmod7660y000vfn8rvs3gsv4s
401
$ curl -s http://localhost:3000/api/downloads/cmod7660y000vfn8rvs3gsv4s
{"error":"Login required"}
```

## What's not tested / follow-ups for the owner

1. **Real Paystack flow**. Drop `PAYSTACK_SECRET_KEY` (sk_test_…) + `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` (pk_test_…) into `.env`, run `npm run dev`, then pay the cart with test card `4084 0840 8408 4081`, any future date, any CVV, PIN `0000`, OTP `123456`. The webhook should mark the order `paid` and the product stock should decrement.
2. **Google OAuth / email magic links**. Only activate when the corresponding env vars are set. Not exercised.
3. **Mobile viewport**. Layout uses `md:`-prefixed breakpoints so it already collapses; not re-captured in the recording.
4. **CI**. No GitHub Actions workflow exists yet — happy to add lint + typecheck + build on every PR in a follow-up.

## Commits pushed during testing

- `cdb753a` — Fix: drop `__Secure-` cookie prefix in dev so session persists on HTTP.
