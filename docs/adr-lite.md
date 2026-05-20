# Architecture Decisions: StudyOracle Marketing Website

**Last Updated:** 2026-05-20

---

## ADR-001: No Scaffolding for Individual Unit Pages

**Status:** Accepted

**Context:**
The intent doc states individual unit pages are "not required at launch" but may be added later. The HLD proposed scaffolding a `[unitCode]` dynamic route skeleton now to anticipate future expansion.

**Decision:**
Do not scaffold individual unit pages. The catalogue remains a single-page filterable grid. Individual unit pages will be added when there is a concrete need, not speculatively.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| Scaffold `[unitCode]` route now, redirect to catalogue | Future-proofs; route exists for SEO crawlers | Adds dead code; redirects confuse users; maintenance burden for unused routes; YAGNI violation |
| Build full unit detail pages now | Best for SEO long-term | Out of scope per intent doc; 76 pages of content to write; delays launch |
| **Do nothing -- add when needed** | Simplest; fastest to deliver; no dead code; App Router makes adding a route trivial later | Loses potential SEO indexing opportunity at launch |

**Rationale:**
The intent doc explicitly scopes unit display as a grid listing only (F2). Next.js App Router makes adding a `/units/[code]` route a single-directory addition with zero architectural changes. Scaffolding unused routes adds cognitive overhead and testing surface for no user value. The 76-unit catalogue is small enough that a single filterable page is appropriate.

**Consequences:**
- No `/units/[code]` routes exist at launch
- SEO relies on the catalogue page and homepage, not per-unit pages
- Adding individual pages later requires only creating `src/app/units/[code]/page.tsx` -- no refactoring

**Resolves:** HLD Open Question #1

---

## ADR-002: Show Both RII Clusters and Standalone Units

**Status:** Accepted

**Context:**
The RII sector includes 6 cluster entries (Clusters 1-6) that bundle multiple units, plus standalone RII units (e.g. RIIQUA601E, RIICWD601E). The question is whether to show clusters only, standalone units only, or both.

**Decision:**
Show both. Cluster entries appear as catalogue items with a "Contains: UNIT1, UNIT2, ..." chip listing constituent unit codes. Standalone RII units that are not part of any cluster also appear individually.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| Clusters only | Cleaner grid; fewer items | Hides standalone units; users searching for specific unit codes won't find them |
| Standalone units only | Every unit code is visible | Doesn't reflect how content is actually packaged and sold |
| **Both -- clusters with constituent chips + standalone units** | Reflects reality of product packaging; all unit codes discoverable; supports both "browse by package" and "search by code" use cases | Slightly more items in the grid; need to design the "contains" chip |

**Rationale:**
The source data includes both clusters and standalone units, and that is how the content is structured and sold. Hiding either would misrepresent the catalogue. The "Contains: ..." chip on cluster cards provides transparency about bundling while keeping the grid scannable.

**Consequences:**
- Cluster cards include a secondary line listing constituent unit codes
- The `Unit` data type needs an optional `clusterUnits` field
- Grid item count for the Engineering & Construction sector is higher (clusters + standalone units)

**Resolves:** HLD Open Question #2

---

## ADR-003: One Entry Per Unit Code with Delivery Mode Tags

**Status:** Accepted

**Context:**
Several CHC units exist in both classroom-based (_CB) and workplace-based (_WB) variants in the source data (e.g. CHCLEG001_RTOW_CB and CHCLEG001_RTOW_WB). Should these appear as one or two catalogue entries?

**Decision:**
One entry per unit code. Each unit card displays delivery mode tags: "Classroom", "Workplace", or both. The build-time script deduplicates by unit code and aggregates delivery modes.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| Two separate entries per delivery mode | No deduplication logic needed; each entry is distinct | Inflates catalogue; confusing -- same unit appearing twice; users may think they are different units |
| **One entry with delivery mode tags** | Clean catalogue; accurate representation -- it is one unit of competency with two delivery options | Requires deduplication logic in build script |
| Hide delivery modes entirely | Simplest display | Loses useful information for RTO buyers who care about delivery mode |

**Rationale:**
A unit of competency is a single nationally defined entity regardless of delivery mode. Showing it twice would confuse RTO buyers who know this. Delivery mode is a property of the study material packaging, not the unit itself, so it belongs as a tag/badge on a single entry.

**Consequences:**
- Build-time script must group by unit code and collect delivery modes into an array
- `Unit` type includes a `deliveryModes: ("Classroom" | "Workplace")[]` field
- Catalogue displays 56-60 unique unit entries (down from 76 raw entries after deduplication)

**Resolves:** HLD Open Question #3

---

## ADR-004: Vercel Function + Resend for Form Handling

**Status:** Accepted

**Context:**
The contact form needs a backend to receive submissions and send email notifications. Options range from a fully managed external form service to a self-hosted serverless function.

**Decision:**
Use a Vercel Serverless Function at `/api/contact` with Resend for email delivery.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| **Vercel Function + Resend** | Full control over validation, rate-limiting, and response format; Resend free tier (100 emails/day) is generous; no third-party form service dependency; keeps architecture self-contained | Requires implementing server-side validation and rate-limiting; Resend API key management |
| Formspree | Zero-config; hosted dashboard for submissions | Third-party dependency; limited customisation; monthly cost at scale; form endpoint visible in client HTML |
| Getform | Similar to Formspree; file upload support | Same third-party concerns; less control over email formatting |
| Vercel Function + SendGrid | More established email provider | More complex setup; heavier SDK; free tier requires more configuration |

**Rationale:**
The intent doc specifies a Vercel-deployed Next.js site, so serverless functions are available at zero additional cost. Resend is purpose-built for transactional email with a simple API, generous free tier, and excellent deliverability. This combination gives full control over validation, honeypot spam detection, and rate-limiting without external dependencies. The `/api/contact` endpoint is not visible to the client as a third-party URL, reducing spam targeting.

**Consequences:**
- A `RESEND_API_KEY` environment variable must be set in Vercel
- A `CONTACT_EMAIL` environment variable configures the recipient (defaults to hello@studyoracle.com)
- Server-side validation, rate-limiting, and honeypot detection are implemented in the function
- No external form service dashboard -- submission history would need to be tracked via email or added later

**Resolves:** HLD Open Question #4

---

## ADR-005: Vercel Analytics for Launch

**Status:** Accepted

**Context:**
The site needs usage analytics to measure marketing effectiveness. Options range from zero-config platform analytics to full-featured third-party services.

**Decision:**
Use Vercel Analytics at launch. Zero configuration, privacy-friendly, no cookie consent banner required.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| **Vercel Analytics** | Zero config; built into Vercel dashboard; privacy-friendly (no cookies); Core Web Vitals tracking; free tier included | Limited feature set compared to GA4; no custom event tracking; vendor-coupled |
| Plausible | Privacy-first; more features than Vercel Analytics; self-hostable | Additional cost ($9/mo); requires script tag; separate dashboard |
| Google Analytics 4 | Most feature-rich; industry standard; free | Requires cookie consent banner (GDPR/privacy); heavier JS payload; impacts Lighthouse score; complex setup |
| No analytics | Simplest | No data on site performance or user behaviour |

**Rationale:**
The site is a marketing landing page at launch, not a complex application. Vercel Analytics provides the essential metrics (page views, visitors, Core Web Vitals, geographic data) with zero configuration and no impact on Lighthouse scores. Since there is no cookie consent requirement, it avoids the UX burden of a consent banner. Plausible can be evaluated post-launch if more detailed analytics are needed.

**Consequences:**
- Analytics are available immediately upon deployment with no additional setup
- No cookie consent banner is needed at launch
- Custom event tracking (e.g. form submissions, CTA clicks) is not available via Vercel Analytics and would need a separate solution if required later
- Switching to Plausible later is straightforward (add script tag, remove Vercel Analytics)

**Resolves:** HLD Open Question #5

---

## ADR-006: Deep Blue and Warm Amber Colour Palette

**Status:** Accepted

**Context:**
No brand colours are defined yet. The site needs a palette that conveys trust, professionalism, and compliance confidence for the VET/RTO market.

**Decision:**
Use a deep blue (#1e3a5f) primary, warm amber (#f59e0b) accent, and slate greys for the neutral scale. This is a placeholder palette that will be replaced when brand assets arrive.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| **Deep blue primary + warm amber accent** | Blue evokes trust and authority (common in education/compliance); amber provides energy and warmth for CTAs; high contrast ratio for accessibility | May need adjustment when real brand assets arrive |
| Neutral blue/slate (Tailwind defaults) | Fastest to implement; no design decisions needed | Generic; indistinguishable from thousands of other sites; doesn't establish brand presence |
| Green primary (education association) | Associated with growth and learning | Overused in education; harder to achieve contrast with CTAs |
| Dark teal + coral | Modern and distinctive | Less trust-evoking than blue for compliance-focused audience |

**Rationale:**
Deep blue is the dominant colour in Australian education and compliance sectors (ASQA, training.gov.au, most RTO websites) because it signals authority and trustworthiness. Warm amber provides sufficient contrast for call-to-action buttons without clashing. Slate greys give a professional neutral background. The palette is defined as Tailwind theme tokens, making it trivial to swap when brand assets arrive.

**Consequences:**
- Tailwind config extends the colour palette with `primary`, `accent`, and `neutral` scales
- All components reference theme tokens, not hardcoded hex values
- Replacing the palette later requires updating only the Tailwind config -- no component changes
- Accessibility contrast ratios must be verified with the chosen palette

**Resolves:** HLD Open Question #6

---

## ADR-007: Inter + Plus Jakarta Sans via next/font

**Status:** Accepted

**Context:**
No typeface has been specified. The site needs a professional, readable font pairing for body text and headings. Fonts must be self-hosted for performance (no external requests).

**Decision:**
Use Inter for body text and Plus Jakarta Sans for headings, loaded via `next/font/google` for automatic self-hosting and optimal performance.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| **Inter (body) + Plus Jakarta Sans (headings)** | Both are free (Google Fonts); Inter is highly readable at all sizes with excellent screen rendering; Plus Jakarta Sans adds geometric character and warmth to headings; both have variable font support for minimal file size; widely used in professional SaaS/B2B sites | Neither is distinctive -- could be seen as "safe" choices |
| Inter only (single font) | Simpler; fewer font files to load | Headings lack visual distinction from body text |
| System font stack | Zero font loading; fastest possible | Inconsistent rendering across platforms; lacks brand presence |
| Geist (Vercel's font) | Designed for Next.js/Vercel projects; modern feel | Less established; limited weight range; may look too "tech startup" for VET compliance audience |

**Rationale:**
The VET/RTO audience values professionalism and readability over novelty. Inter is the industry standard for readable body text on screens, with excellent hinting and a large character set. Plus Jakarta Sans adds enough geometric personality to headings to create visual hierarchy without appearing informal. Both fonts are free, have variable font support (reducing file size), and are natively supported by `next/font` for zero-layout-shift loading.

**Consequences:**
- Two font families loaded via `next/font/google` with `display: 'swap'`
- Font variables applied via CSS custom properties in the root layout
- Body text uses Inter; headings (h1-h4) use Plus Jakarta Sans
- If brand guidelines specify different fonts later, only the `next/font` import and Tailwind config need updating

**Resolves:** HLD Open Question #7

---

## ADR-008: No Blog Architecture at Launch

**Status:** Accepted

**Context:**
The intent doc says "no blog at launch, may be added later." The HLD asked whether to scaffold an MDX-based blog skeleton now.

**Decision:**
No blog architecture at launch. No skeleton, no MDX configuration, no `/blog` route. Add it when there is content to publish.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| Scaffold MDX blog now | Ready for content when needed; demonstrates "thought leadership" intent | No content to publish; dead route; adds MDX dependencies and configuration; maintenance burden |
| **No blog -- add when needed** | Simplest; no dead code; App Router makes adding `/blog` trivial later; no MDX config overhead | Loses potential SEO authority-building time |
| Use a CMS-backed blog | Most flexible content editing | Violates NG3 (no CMS); adds external dependency |

**Rationale:**
The intent doc explicitly lists "no blog at launch" as a known boundary (NF5). Scaffolding unused infrastructure violates YAGNI and adds configuration (MDX, rehype plugins, content directory structure) that must be maintained without providing value. When blog content is ready, adding an MDX-based `/blog` route in the App Router is a self-contained addition requiring no architectural changes.

**Consequences:**
- No `/blog` route or MDX configuration at launch
- SEO authority relies on the catalogue page, homepage, and about page
- Adding a blog later is a feature addition, not a refactoring effort

**Resolves:** HLD Open Question #8

---

## ADR-009: Three Mega-Sector Grouping for Filtering

**Status:** Accepted

**Context:**
The source data has 5 sector prefixes (CHC, BSB, RII, MEM, CPP), but MEM (2 units) and CPP (1 unit) are too small for standalone filter categories. The source data also categorises MEM and CPP units under "RII RTOW", indicating they are delivered as part of the same program.

**Decision:**
Group units into three mega-sectors for filtering:
1. **Community Services** (CHC) -- all CHC-prefixed units
2. **Business** (BSB) -- all BSB-prefixed units
3. **Engineering & Construction** (RII, MEM, CPP) -- all RII-prefixed units, clusters, MEM units, and the CPP unit

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| 5 separate filters (CHC, BSB, RII, MEM, CPP) | Exact match to training package codes; familiar to VET professionals | MEM filter shows only 2 units; CPP filter shows 1 unit; cluttered filter UI for tiny categories |
| **3 mega-sectors (Community Services, Business, Engineering & Construction)** | Clean filter UI; each category has meaningful volume; matches how programs are delivered; "Engineering & Construction" is a recognisable industry label | Abstracts away training package codes -- but these are still visible on individual unit cards |
| 2 groups (Community Services, Everything Else) | Simplest possible filter | Hides BSB as a distinct offering; too coarse for catalogue browsing |

**Rationale:**
The filter UI serves RTO decision-makers who are browsing the catalogue. Three meaningful categories with 15+ units each are more useful than five categories where two have 1-2 units. The training package prefix (CHC, BSB, RII, MEM, CPP) is still displayed on each unit card, so VET-literate users can identify the exact training package. The "Engineering & Construction" label accurately describes the RII/MEM/CPP program cluster and is recognisable in the Australian VET context.

**Consequences:**
- Filter UI shows three buttons/tabs: Community Services, Business, Engineering & Construction
- Sector mapping logic in the build script maps CHC->Community Services, BSB->Business, RII/MEM/CPP->Engineering & Construction
- Unit cards still display the original training package prefix code
- If MEM or CPP units grow significantly in future, they can be split out into their own filter category

**Resolves:** HLD Open Question #9

---

## ADR-010: Environment Variable for Contact Email Recipient

**Status:** Accepted

**Context:**
The contact form needs to send notifications to the StudyOracle team. The recipient address needs to be configurable without code changes.

**Decision:**
Use an environment variable `CONTACT_EMAIL` that defaults to `hello@studyoracle.com`. The Vercel serverless function reads this at runtime.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| **Environment variable with default** | Configurable per environment; no code change needed to update recipient; works for staging (send to dev) vs production (send to team) | Requires Vercel env var configuration |
| Hardcoded email in code | Simplest | Requires code change and redeploy to update recipient; staging sends to production inbox |
| Multiple recipients via comma-separated env var | Supports distribution lists | Over-engineered for launch; a shared inbox or distribution list at the email provider level is better |

**Rationale:**
An environment variable is the standard pattern for deployment-specific configuration. It allows the staging environment to send to a test address while production sends to the real inbox. The default value (`hello@studyoracle.com`) ensures the function works even if the variable is not explicitly set.

**Consequences:**
- `CONTACT_EMAIL` must be set in Vercel environment variables (or defaults to hello@studyoracle.com)
- The serverless function reads `process.env.CONTACT_EMAIL` at invocation time
- Multiple recipients can be achieved by pointing the address at a distribution list, not by changing the application

**Resolves:** HLD Open Question #10

---

## ADR-011: Domain and DNS Verified During Implementation

**Status:** Accepted

**Context:**
The HLD asked whether studyoracle.com is registered and pointed to Vercel.

**Decision:**
Domain and DNS configuration is an implementation-time verification task, not an architectural decision. Verify during the Vercel project setup phase.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| **Verify during implementation** | Pragmatic; no architectural implication; just a setup task | Could delay launch if not done early |
| Resolve now with a DNS design doc | Thorough | Over-engineered for a single-domain static site on Vercel |

**Rationale:**
DNS configuration for a Vercel-hosted site is a standard operational task (add A/CNAME records in the domain registrar, verify in Vercel dashboard). It has no architectural implications and does not affect any design decision. Vercel's automatic SSL provisioning handles HTTPS. The implementation checklist should include a DNS verification step.

**Consequences:**
- Implementation checklist includes: "Verify studyoracle.com DNS points to Vercel"
- No architectural changes regardless of the DNS outcome
- If the domain is not yet registered, it must be registered before launch

**Resolves:** HLD Open Question #11

---

## ADR-012: Text-Based "SO" Placeholder for Favicon and OG Image

**Status:** Accepted

**Context:**
No brand assets (logo, favicon, social sharing image) are available yet. The site needs visual identity placeholders that look professional enough for launch.

**Decision:**
Use a text-based "SO" placeholder generated as an SVG favicon and a 1200x630 OG image with the "SO" mark on the deep blue background with the tagline "VET Study Materials".

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| **Text-based "SO" placeholder** | Professional appearance; on-brand (StudyOracle initials); can be generated programmatically; easy to swap when real logo arrives | Not a real logo; limited brand expression |
| Generic favicon (e.g. Vercel default) | Zero effort | Looks unprofessional; no brand identity; forgettable in browser tabs |
| Commission a logo now | Best brand outcome | Delays launch; outside scope of this project |
| No favicon / default browser icon | Simplest | Looks broken; fails basic professionalism test |

**Rationale:**
A text-based "SO" mark in the brand colour palette (deep blue background, white text) provides sufficient visual identity for launch. It is recognisable in browser tabs and social sharing previews. The OG image uses the same mark with the tagline to give shared links a professional appearance. Both assets are SVG/PNG files in the `public/` directory, trivially replaceable when real brand assets are created.

**Consequences:**
- `public/favicon.svg` contains the "SO" mark
- `public/og-image.png` is a 1200x630 image with the "SO" mark and tagline
- Both files are referenced in the root layout metadata
- When real brand assets arrive, replace these two files and update the metadata -- no code changes

**Resolves:** HLD Open Question #12
