# Axia

Freelance rate intelligence — what clients actually pay independent designers,
developers, photographers, and writers. By city, by skill, by experience level.

This repo is the production landing + waitlist for **axiaradar.com**.

## Stack

- **Next.js 14** (App Router, TypeScript, Tailwind)
- **Supabase** — Postgres for the waitlist (RLS on, server-only writes via service_role)
- **Resend** — transactional welcome email
- **Vercel** — hosting + serverless functions
- **Cloudflare** — DNS only (gray cloud — proxy off, Vercel issues SSL)

See `RUNBOOK.md` for the full deploy walkthrough.

## Layout

```
app/
  layout.tsx            metadata + GA slot
  page.jsx              the landing (single-page; renders home/about/pricing internally)
  globals.css           tailwind directives + reset
  sitemap.ts            /sitemap.xml
  robots.ts             /robots.txt
  api/
    waitlist/
      route.ts          POST /api/waitlist — validate, store, email
lib/
  supabase.ts           server-side Supabase client (service_role)
  resend.ts             Resend client + welcome email template
.env.local.example      env var template
```

## Local dev

```bash
npm install
cp .env.local.example .env.local
# fill in real values in .env.local
npm run dev
# → http://localhost:3000
```

## Environment variables

All five are required for production. The first four power the API; the last is
optional and enables Google Analytics 4 if set.

| Var | Source | Notes |
|---|---|---|
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL | |
| `SUPABASE_SERVICE_KEY` | Supabase → Project Settings → API → `service_role` (NOT `anon`) | server-only; never expose |
| `RESEND_API_KEY` | Resend → API Keys → Create API Key | |
| `RESEND_FROM_EMAIL` | `Axia <hello@axiaradar.com>` | domain must be verified in Resend |
| `AXIA_WAITLIST_SECRET` | `openssl rand -hex 32` | HMAC key for `ip_hash` (and reserved for future signed tokens) |
| `NEXT_PUBLIC_SITE_URL` | `https://axiaradar.com` | optional; falls back to that default |
| `NEXT_PUBLIC_GA_ID` | GA4 → Web stream → Measurement ID (`G-...`) | optional; if unset, GA tag is not rendered |

## Database schema

`public.waitlist` — already created in Supabase. Columns:

```
id            uuid PK
email         text unique not null
source        text          ('hero' | 'footer' | 'finalcta' | 'pricing' | 'landing')
ref           text          optional referral
ip_hash       text          HMAC-SHA256 of client IP, keyed with AXIA_WAITLIST_SECRET
user_agent    text
confirmed_at  timestamptz   reserved for double-opt-in flow (not used yet)
invited_at    timestamptz   set when you invite them to beta
created_at    timestamptz   default now()
notes         text          internal
```

RLS is enabled with no policies — only the server (service_role) can read/write.

## API

### `POST /api/waitlist`

Body:

```json
{ "email": "you@example.com", "source": "hero", "ref": null }
```

- `email` — required, validated, lowercased, max 254 chars
- `source` — optional, must be one of `hero | footer | finalcta | pricing | landing` (defaults to `landing`)
- `ref` — optional, free-form referral string, max 200 chars

Behavior:

- Inserts a row in `public.waitlist`, hashing the client IP with `AXIA_WAITLIST_SECRET`
- If the email already exists (Postgres `unique_violation` / 23505), responds 200 with `alreadyOnList: true` and **does not** re-send the welcome email
- Sends the welcome email via Resend on first signup — failures here are logged but do not fail the response (the user is on the list either way)

Response:

```json
{ "ok": true, "alreadyOnList": false }
```

## Deploy notes

- Push to GitHub → Import in Vercel → set the env vars above → Deploy.
- Add `axiaradar.com` and `www.axiaradar.com` in Vercel domains.
- In Cloudflare, add the records Vercel shows you (`A @ 76.76.21.21` and `CNAME www → cname.vercel-dns.com`), **proxy: DNS only (gray cloud)**.
- In Resend, verify `axiaradar.com` (DNS records also added in Cloudflare, gray cloud).
- After deploying, paste the Supabase + Resend creds into Vercel env vars and redeploy.

## Known limitations / next steps

- The landing renders home/about/pricing as internal SPA views (`setPage`), not as separate Next.js routes. The sitemap therefore only exposes `/`. If/when those become real routes, add them in `app/sitemap.ts`.
- No double-opt-in flow yet. The schema has `confirmed_at` reserved for it; flip it on later by adding a `/api/waitlist/confirm` route that verifies a signed token.
- No rate limiting. Add Upstash Ratelimit or Vercel Edge Config when traffic warrants it.
- Privacy policy + Terms (`/privacy`, `/terms`) not yet added — see RUNBOOK Phase 11.3.

## Status

Phase 0 (this repo) is done. Remaining runbook phases (1–12) are manual: domain
✅ purchased, Cloudflare DNS, Vercel deploy, Supabase ✅ schema applied, Resend ✅
project created, Search Console, GA4, OG image, launch.
