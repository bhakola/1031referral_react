# 1031 Referral

A React + Node.js rebuild of **1031referral.com** — a lead-generation site for a 1031 Exchange
Qualified Intermediary (QI) referral service. Migrated from a legacy WordPress + Elementor +
Ninja Forms site to a modern, statically-rendered Next.js app that deploys to Vercel.

## Stack

- **Next.js 16** (App Router) — React framework running on Node.js
- **React 19**
- **Tailwind CSS v4** — theme/brand tokens defined in `src/app/globals.css`
- **next/font** — Merriweather (headings) + Lato (body), self-hosted at build time
- Deploys to **Vercel** with zero configuration

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Project structure

```
src/
  app/
    layout.tsx          Root layout: fonts, SEO metadata
    page.tsx            Home page — composes all sections
    globals.css         Brand tokens (@theme) + base styles
    thank-you/page.tsx  Post-submission confirmation page
  components/
    Nav.tsx             Sticky header + mobile menu (client)
    Hero.tsx            Hero with courtyard background
    QualifiedIntermediary.tsx
    WhatIs1031.tsx
    Steps.tsx           1031 Exchange steps (original SVG illustrations)
    FindAccommodator.tsx  Lead form with validation (client)
    Footer.tsx
  content/
    site.ts             Single source of truth for all page copy
public/
  assets/               Logos, step SVGs, background images
```

All page copy lives in `src/content/site.ts`, extracted from the original site's Elementor data,
so content edits never require touching component markup.

## Brand tokens

| Token | Value | Usage |
|-------|-------|-------|
| Gold  | `#F6B431` | Primary CTA / accents (`bg-gold`, `text-gold`) |
| Navy  | `#344D71` | Secondary / hero (`bg-navy`, `text-navy`) |
| Ink   | `#253957` | Body text (`text-ink`) |
| Font (headings) | Merriweather | `font-heading` |
| Font (body)     | Lato        | `font-body` |

## Lead form and referral prefill

The **Find An Accommodator** form (`src/components/FindAccommodator.tsx`) mirrors the original
visible Ninja Forms field set: First Name, Last Name, Phone, Cell Phone, Email, Sale Property
Address, Anticipated Closing Date, and Anticipated Sales Price. The legacy hidden identifier field
is preserved for integration, but it is not shown to visitors.

### Referral link prefill (how the client's "provided link" worked)

On the original site, a visitor arriving via a provided link had the form pre-filled. That link
carried a **Propertybase record id** in a hidden "Customer ID" field (`default = {querystring:id}`),
and the `ffd-web2prospect` plugin looked the record up in Propertybase to populate the fields.

This rebuild reproduces that behavior. The form reads the URL query string on load
(`src/lib/propertybase.ts` → `parsePrefillParams`) and pre-fills. Try a link like:

```
/?firstName=Jane&lastName=Investor&email=jane@example.com&phone=4155551212
  &propertyId=a0Q04000002XvJ9EAK&address=123%20Market%20St&price=1250000
```

When a referral id is present, the form keeps the original hidden-field behavior: `?id=` is captured
as the legacy hidden `Customer ID` value and also retained as `propertyId` for the Salesforce handoff.
No Property ID field or referral panel is rendered in the UI. Accepted query aliases (e.g. `id`,
`contactId`, `property_id`) are defined in `src/lib/propertybase.ts`.

### Propertybase / Salesforce integration (Node API routes)

Two Node Route Handlers are scaffolded and wired to the form. They run in **dry-run mode**
today (no credentials needed for the wireframe) and become live once the env vars in
[`.env.example`](.env.example) are set — no code changes required.

| Route | Method | Purpose |
|-------|--------|---------|
| `src/app/api/lead/route.ts` | POST | Validates the lead and forwards it to the Web2Prospect endpoint, creating a Contact + `pba__Request__c`. Dry-run returns `{ ok: true, dryRun: true }`. |
| `src/app/api/prefill/route.ts` | GET | Resolves `?id=<Property a0E…>` / `?contactId=<003…>` to the visitor's details for prefill. Dry-run returns `{}`. |

Server-only logic lives in [`src/lib/propertybase-server.ts`](src/lib/propertybase-server.ts)
(`submitProspect`, `lookupProspect`); the isomorphic field model, payload builder, and query-param
parsing live in [`src/lib/propertybase.ts`](src/lib/propertybase.ts).

**Still pending from the client** (the routes are ready for both):
- **Credentials** — Web2Prospect base URL + token, and Salesforce REST access for the prefill
  lookup. Set them per `.env.example`. ⚠️ A token was present in the old DB dump — rotate it.
- The **prefill read query** — the one piece not recoverable from the backup (the
  `ffd-web2prospect` plugin binary wasn't included). The exact SOQL/relationship is stubbed with a
  `TODO(propertybase-lookup)` in `propertybase-server.ts`, to confirm against the client's org.
- The **Lead-vs-Contact / `pba__Request__c`** modelling decision.

Note: the QI **round-robin assignment happens in Salesforce/Propertybase, not here** — the site
only hands off the lead (with `Routing_Source__c = "Web Leads"`); Salesforce assignment rules route
it to the next agent.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected; no
   configuration needed.
3. Deploy.

## Provenance

Rebuilt from the June 22, 2026 hosting backup of `1031referral.com`. Copy and assets were
extracted from the original WordPress/Elementor database and `wp-content/uploads`.
