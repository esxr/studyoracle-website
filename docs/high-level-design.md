# High-Level Design: StudyOracle Marketing Website

**Version:** 1.1
**Date:** 2026-05-20
**Status:** Approved (all open questions resolved -- see ADR-Lite)

---

## 1. Overview

StudyOracle is a B2B provider of VET (Vocational Education and Training) study materials in Australia, selling to RTOs, TAFEs, private colleges, enterprise trainers, and compliance consultants. This document describes the high-level design for the StudyOracle marketing website (studyoracle.com) -- a statically generated, SEO-first site built on Next.js that showcases the unit catalogue, establishes compliance credibility, and captures inbound leads from RTO decision-makers.

The site is deliberately scoped as a marketing/lead-generation tool, not a SaaS application. There is no authentication, no database, no CMS, and no e-commerce. All unit data is compiled at build time from a static source file derived from the study-material-database.

---

## 2. Goals and Non-Goals

### Goals

- **G1:** Communicate StudyOracle's value proposition -- compliance confidence, trainer efficiency, audit readiness -- within seconds of landing
- **G2:** Showcase the full catalogue of 76 units across three mega-sectors -- Community Services (CHC), Business (BSB), and Engineering & Construction (RII/MEM/CPP) -- with sector-based filtering (see ADR-009)
- **G3:** Generate inbound leads via a contact/sample-request form targeting RTO compliance managers, training managers, and procurement staff
- **G4:** Rank organically for qualification-code and unit-code searches (e.g. "CHC33021 learning resources", "RTO assessment tools Australia") within 3-6 months
- **G5:** Use only ASQA-safe marketing language -- zero prohibited claims anywhere on the site
- **G6:** Achieve Lighthouse scores of 90+ in all four categories (Performance, Accessibility, Best Practices, SEO)
- **G7:** Provide a mobile-responsive, WCAG 2.1 AA accessible experience

### Non-Goals

- **NG1:** E-commerce, payment processing, or pricing pages
- **NG2:** User accounts, authentication, or dashboards
- **NG3:** Content management system (Contentful, Sanity, Strapi, etc.)
- **NG4:** Individual unit detail pages at launch (catalogue is a grid listing only)
- **NG5:** Blog or ongoing content publishing at launch
- **NG6:** Sample file downloads (placeholder only at launch)
- **NG7:** Real testimonials, case studies, or reviewer credential content (placeholder sections only)
- **NG8:** API integrations or dynamic data fetching at runtime

---

## 3. System Architecture

### Component Diagram

```
+-------------------------------------------------------+
|                    Vercel Edge Network                 |
|                   (CDN + Static Hosting)               |
+---------------------------+---------------------------+
                            |
              Static Assets (HTML, CSS, JS, images)
                            |
+---------------------------v---------------------------+
|                 Next.js App (SSG Build)                |
|                                                       |
|  +-------------+  +----------------+  +------------+  |
|  |  Homepage   |  | Unit Catalogue |  | About/Trust|  |
|  |  (/)        |  | (/units)       |  | (/about)   |  |
|  +-------------+  +----------------+  +------------+  |
|                                                       |
|  +-------------+  +----------------+  +------------+  |
|  |  Contact    |  |  Privacy       |  |  Terms     |  |
|  |  (/contact) |  |  (/privacy)    |  |  (/terms)  |  |
|  +-------------+  +----------------+  +------------+  |
|                                                       |
|  +------------------------------------------------+  |
|  |            Shared Layout & Components           |  |
|  |  Header | Footer | SEO Meta | Structured Data   |  |
|  +------------------------------------------------+  |
|                                                       |
|  +------------------------------------------------+  |
|  |        Static Data Layer (Build-Time)           |  |
|  |  units.ts -- typed unit catalogue from JSON     |  |
|  +------------------------------------------------+  |
+-------------------------------------------------------+
                            |
               Contact Form Submission
                            |
+---------------------------v---------------------------+
|           Serverless Form Handler                     |
|   (Vercel Function OR External Form Service)          |
|   Sends notification email to StudyOracle team        |
+-------------------------------------------------------+
```

### Component Descriptions

| Component | Responsibility | Key Interfaces |
|---|---|---|
| **Next.js App (SSG)** | Static site generation at build time; produces pure HTML/CSS/JS | Vercel build pipeline |
| **Homepage** | Hero, value proposition, trust signals, sector overview, CTAs | Links to /units and /contact |
| **Unit Catalogue** | Filterable grid of all units across 3 mega-sectors (Community Services, Business, Engineering & Construction) with sector tags and delivery mode badges | Reads from static data layer; client-side filtering via JS |
| **About/Trust** | Review process, reviewer credentials (placeholder), case studies (placeholder), testimonials (placeholder) | Static content |
| **Contact** | Lead capture form (Name, Organisation, Role, Email, Phone, Message) | Submits to serverless function or form service |
| **Privacy / Terms** | Legal placeholder pages | Static content |
| **Shared Layout** | Header, footer, navigation, SEO meta tags, JSON-LD structured data, sitemap | All pages |
| **Static Data Layer** | Typed unit catalogue compiled from source JSON at build time | Imported by Unit Catalogue page at build time |
| **Form Handler** | Receives form submissions, validates, sends email notification | POST endpoint; email delivery |

---

## 4. Data Flow

### 4.1 Unit Data: Source to Static Pages

```
study-material-database/course_list.json
       |
       | (Build-time script: extract, clean, re-type)
       v
website/src/data/units.ts
       |
       | Typed array of UnitEntry objects:
       | { code, name, sector, sectorLabel, tags }
       |
       | (Next.js static import at build time)
       v
+------------------+    +-------------------+
| Unit Catalogue   |    | Homepage Sector   |
| Page (/units)    |    | Overview Section  |
| - Full grid      |    | - Sector counts   |
| - Client filter  |    | - Sector links    |
+------------------+    +-------------------+
       |
       | (Client-side JS: filter by sector/search)
       v
  Filtered Grid View in Browser
```

**Processing details:**

1. A build-time script reads `course_list.json` (76 entries, ~45 CHC, ~16 BSB, ~12 RII, 2 MEM, 1 CPP)
2. It extracts the unit code from the `shortname` field (e.g. `CHCCOM005` from `CHCCOM005_RTOW`), the display name from `fullname`, and derives the sector from the `category` field
3. Duplicate unit codes delivered in multiple modes (e.g. classroom-based vs workplace-based) are deduplicated into a single catalogue entry with a delivery mode note
4. The RII cluster entries (Clusters 1-6) are preserved as catalogue items since they represent how the content is packaged, but each cluster's constituent unit codes are listed if available
5. The build-time script strips all internal URLs (e.g. LMS links) from the source data. Only unit codes, names, and sector tags are exposed on the public site. No internal infrastructure references appear in the built output.
6. The output is a TypeScript file exporting a typed array, ensuring type safety and IDE support
7. At build time, Next.js statically imports this data -- no runtime fetching

### 4.2 Contact Form Submission

```
User fills form (/contact)
       |
       | (Client-side validation: required fields, email format)
       v
POST /api/contact (Vercel Serverless Function)
       |
       | (Server-side validation: sanitise, rate-limit)
       v
Email notification to StudyOracle team
       |
       | (SMTP service, e.g. Resend / SendGrid / AWS SES)
       v
User sees success confirmation in browser
```

**Email delivery:** The serverless function uses Resend (via `RESEND_API_KEY` environment variable) to send notification emails to the address specified in `CONTACT_EMAIL` (defaults to hello@studyoracle.com). See ADR-004 and ADR-010.

---

## 5. Technology Choices

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSG support, file-based routing, React Server Components, image optimisation, excellent Vercel integration, strong SEO capabilities |
| **Rendering** | Static Site Generation (SSG) | All content is known at build time; no dynamic data; fastest possible page loads; full CDN cacheability |
| **Styling** | Tailwind CSS v4 | Utility-first approach eliminates CSS bloat; design-system consistency via config; purges unused styles at build time for minimal CSS payload |
| **Hosting** | Vercel | Native Next.js host; global CDN; automatic preview deployments; serverless functions for form handler; zero DevOps |
| **Form handling** | Vercel Serverless Function + Resend | Full control over validation, rate-limiting, and email delivery; Resend free tier (100 emails/day); recipient configurable via `CONTACT_EMAIL` env var (see ADR-004, ADR-010) |
| **Email delivery** | Resend | Generous free tier, simple API, good deliverability (see ADR-004) |
| **Analytics** | Vercel Analytics | Zero-config, privacy-friendly, no cookie consent required; Core Web Vitals tracking included (see ADR-005) |
| **Fonts** | Inter (body) + Plus Jakarta Sans (headings) via `next/font` | Self-hosted for performance; professional, highly readable; variable font support for minimal payload (see ADR-007) |
| **Colour palette** | Deep blue (#1e3a5f) primary, warm amber (#f59e0b) accent, slate greys | Trust-evoking for VET/compliance audience; placeholder until brand assets arrive; defined as Tailwind theme tokens (see ADR-006) |
| **Icons** | Lucide React or Heroicons | Tree-shakeable SVG icon libraries; Tailwind-compatible; no external requests |
| **Animation** | Tailwind CSS transitions + Framer Motion (minimal) | Light CSS transitions for hover/reveal states; Framer Motion only if needed for hero animations -- must not impact Lighthouse score |
| **Linting/Formatting** | ESLint + Prettier + Tailwind plugin | Code consistency; Next.js ESLint config catches common issues |
| **Type safety** | TypeScript (strict mode) | Catches data-shape errors in unit catalogue processing; IDE support; maintainability |
| **Structured data** | JSON-LD (Organisation schema) | Improves search result appearance; validates with Google Rich Results Test |
| **Sitemap** | next-sitemap or built-in Next.js sitemap | Automatic sitemap.xml generation from pages; submitted to Google Search Console |
| **Image optimisation** | next/image | Automatic WebP/AVIF conversion, lazy loading, responsive sizing |

---

## 6. Key Design Decisions

### KD1: Pure SSG with No Runtime Data Fetching

All pages are generated at build time. The unit catalogue data is a static TypeScript file, not fetched from an API or CMS. This eliminates latency, ensures 100% uptime (served from CDN), and simplifies the architecture. The trade-off is that updating unit data requires a rebuild and redeploy, but since the catalogue changes infrequently (new units are added perhaps quarterly), this is acceptable.

### KD2: Client-Side Filtering, Not Separate Sector Pages

The unit catalogue is a single page with client-side JavaScript filtering by sector and search. This was chosen over generating separate pages per sector because: (a) 76 units is small enough for a single page, (b) instant filtering is a better UX than page navigation, and (c) it reduces build complexity. The filtering logic runs entirely in the browser with no server calls.

### KD3: No Individual Unit Detail Pages at Launch

The intent doc explicitly scopes unit display as "unit code, unit name, sector tag" in a grid. Individual unit pages could be added later to improve SEO (one page per unit code), but at launch the catalogue is a listing only. No skeleton route is scaffolded -- the App Router makes adding a `/units/[code]` route trivial when needed (see ADR-001).

### KD4: RII Cluster Units Displayed as Cluster Packages

The RII sector includes 6 cluster entries (Clusters 1-6) that bundle multiple units into a single study material package. These are displayed as catalogue items in their own right, since that is how the content is structured and sold. Each cluster card may list its constituent unit codes as secondary information. Standalone RII units (e.g. RIIQUA601E, RIICWD601E) are displayed individually alongside the clusters.

### KD5: ASQA-Safe Copy as a Design Constraint, Not an Afterthought

Every text string on the site must comply with the approved/prohibited claims table from the intent doc. This is enforced at the component level: trust signal components accept only pre-approved copy strings, and a lint rule or code review checklist will flag prohibited terms ("ASQA approved", "Government certified", "Guaranteed compliant", "Audit-proof", "No RTO review required").

### KD6: Vercel Function + Resend for Form Handling

A Vercel serverless function at `/api/contact` handles form submissions with Resend for email delivery. This gives full control over server-side validation, honeypot spam detection, rate-limiting, and response formatting. The recipient address is configured via the `CONTACT_EMAIL` environment variable, defaulting to hello@studyoracle.com (see ADR-004, ADR-010).

### KD7: Inter + Plus Jakarta Sans via next/font

Inter (body) and Plus Jakarta Sans (headings) are loaded via `next/font/google` for automatic self-hosting, eliminating render-blocking external requests and ensuring zero-layout-shift loading. Both are free, professional, and have variable font support for minimal file size. This is a placeholder pairing that will be replaced if brand guidelines specify different fonts (see ADR-007).

---

## 7. Open Questions (All Resolved)

All open questions from v1.0 have been resolved via Architecture Decision Records. See `/website/docs/adr-lite.md` for full rationale.

### Ambiguities in Requirements

- [x] **Individual unit pages in future?** -- **Resolved (ADR-001):** Do not scaffold. No skeleton route. Add `/units/[code]` when there is a concrete need.
- [x] **RII cluster display vs constituent units** -- **Resolved (ADR-002):** Show both. Clusters display a "Contains: UNIT1, UNIT2, ..." chip. Standalone RII units appear individually.
- [x] **Duplicate delivery modes** -- **Resolved (ADR-003):** One entry per unit code with delivery mode tags (Classroom / Workplace / Both).

### Design Alternatives

- [x] **Form handling** -- **Resolved (ADR-004):** Vercel Serverless Function + Resend. Full control over validation and email delivery.
- [x] **Analytics** -- **Resolved (ADR-005):** Vercel Analytics for launch. Zero config, privacy-friendly, no cookie consent needed.
- [x] **Colour palette** -- **Resolved (ADR-006):** Deep blue (#1e3a5f) primary, warm amber (#f59e0b) accent, slate greys. Placeholder until brand assets arrive.
- [x] **Font choice** -- **Resolved (ADR-007):** Inter (body) + Plus Jakarta Sans (headings) via `next/font`. Both free, professional, variable font support.
- [x] **Blog architecture** -- **Resolved (ADR-008):** No. Add later when needed. No skeleton, no MDX config.

### Clarifications Needed

- [x] **MEM and CPP sector labelling** -- **Resolved (ADR-009):** Group under "Engineering & Construction" mega-sector alongside RII. Three top-level filters: Community Services (CHC), Business (BSB), Engineering & Construction (RII/MEM/CPP).
- [x] **Contact form recipient** -- **Resolved (ADR-010):** Environment variable `CONTACT_EMAIL`, defaults to hello@studyoracle.com.
- [x] **Domain and DNS** -- **Resolved (ADR-011):** Verify during implementation. Not an architecture concern.
- [x] **Favicon and OG image** -- **Resolved (ADR-012):** Text-based "SO" placeholder logo (SVG favicon + 1200x630 OG image). Swap when real assets arrive.

---

## 8. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| **Prohibited ASQA claims slip into copy** | H -- Regulatory exposure; loss of RTO trust | Maintain an approved-copy component library; add a pre-commit lint check scanning for prohibited terms; peer review all copy changes |
| **Brand name "Oban College" leaks into site** | H -- Confuses brand identity; SEO contamination | Source data processing strips all references; CI grep check for prohibited strings; code review checklist |
| **Unit data drifts from study-material-database** | M -- Catalogue shows stale or incorrect units | Build-time script reads from canonical source; rebuild triggered on source update; add a data freshness check to CI |
| **Contact form spam** | M -- Inbox flooded; real leads buried | Server-side rate limiting; honeypot field; optional CAPTCHA (hCaptcha for privacy); email validation |
| **Poor Lighthouse scores from animation/font bloat** | M -- SEO penalty; poor first impression | Budget animations strictly; self-host fonts; measure Lighthouse in CI; set a score regression threshold |
| **Vercel vendor lock-in** | L -- Migration effort if hosting changes | Standard Next.js with no Vercel-specific APIs beyond serverless functions; could deploy to Cloudflare Pages or Netlify with minimal changes |
| **Delayed brand assets block launch** | M -- Cannot ship final visual design | Build with a placeholder design system (Tailwind defaults); swap in brand tokens when available without structural changes |
| **Accessibility violations** | M -- Legal risk; excludes users | Use semantic HTML; test with axe-core in CI; manual screen reader testing before launch |

---

## 9. Traceability

| Intent Requirement | HLD Section | Notes |
|---|---|---|
| **F1: Homepage** (hero, trust signals, sector overview, CTA) | 3 (Component Diagram -- Homepage), 6 (KD5: ASQA-safe copy) | Trust signals use only approved wording from NF6 |
| **F2: Unit Catalogue** (filterable grid, sector filter, unit display) | 3 (Component Diagram -- Unit Catalogue), 4.1 (Unit Data Flow), 6 (KD2: Client-side filtering, KD3: No individual pages, KD4: RII clusters) | 3 mega-sectors (Community Services, Business, Engineering & Construction); client-side filter; deduplicated by unit code with delivery mode tags (see ADR-003, ADR-009) |
| **F3: About / Trust Page** (review process, credentials, case studies, testimonials) | 3 (Component Diagram -- About/Trust) | All content sections are placeholders at launch |
| **F4: Contact / Lead Capture** (form with specified fields) | 3 (Component Diagram -- Contact), 4.2 (Form Submission Flow), 6 (KD6: Serverless function) | Fields: Name, Organisation, Role, Email, Phone (optional), Message |
| **F5: SEO-Driven Content Structure** (qualification codes, unit codes) | 5 (Structured data, Sitemap, next/image), 6 (KD3: No individual pages at launch) | JSON-LD Organisation schema; semantic HTML; sitemap; unit pages deferred (ADR-001) |
| **F6: Legal Compliance** (disclaimer, privacy, terms) | 3 (Component Diagram -- Privacy, Terms), 6 (KD5: ASQA-safe copy) | Disclaimer in footer; placeholder legal pages |
| **NF1: Technology Stack** (Next.js, Tailwind, Vercel) | 5 (Technology Choices table) | All choices match intent constraints |
| **NF2: Performance** (Lighthouse 90+, SSG, fast load) | 5 (SSG, next/image, self-hosted fonts), 6 (KD1: Pure SSG, KD7: Self-hosted fonts), 8 (Lighthouse risk) | Lighthouse CI gate recommended |
| **NF3: SEO** (semantic HTML, OG tags, structured data, sitemap) | 5 (JSON-LD, sitemap, next/image), 3 (Shared Layout includes SEO meta) | Per-page meta tags; JSON-LD Organisation schema |
| **NF4: Responsive Design** (mobile-first, desktop primary) | 5 (Tailwind CSS -- mobile-first utilities) | Tailwind's responsive prefix system (sm/md/lg/xl) |
| **NF5: Accessibility** (WCAG 2.1 AA) | 5 (Tailwind, semantic HTML), 8 (Accessibility risk) | axe-core CI integration; manual testing |
| **NF6: Safe Marketing Language** (approved/prohibited table) | 6 (KD5: ASQA-safe copy), 8 (Prohibited claims risk) | Component-level enforcement; lint rule; peer review |
| **Known Boundary: No e-commerce** | 2 (NG1) | Explicitly out of scope |
| **Known Boundary: No user accounts** | 2 (NG2) | Explicitly out of scope |
| **Known Boundary: No CMS** | 2 (NG3) | Data managed as code |
| **Known Boundary: Placeholders only** | 2 (NG6, NG7) | Testimonials, case studies, credentials, samples |
| **Known Boundary: No blog at launch** | 2 (NG5), 7 (Blog architecture question) | No skeleton scaffolded (ADR-008); add when content exists |
| **Known Boundary: Static unit data** | 4.1 (Unit Data Flow), 6 (KD1: Pure SSG) | Built from study-material-database at build time |
