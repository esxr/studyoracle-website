# Intent and Constraints: StudyOracle Marketing Website

**Date:** 2026-05-20  
**Owner:** Pranav  
**Status:** Draft — Awaiting Approval

---

## 1. Problem Statement

StudyOracle is a B2B provider of VET (Vocational Education and Training) study materials in Australia. The primary buyers are RTOs (Registered Training Organisations), TAFEs, private colleges, enterprise trainers, and compliance consultants — not students directly.

There is currently no public-facing website. StudyOracle needs a marketing site that:
- Establishes authority and trust in a compliance-heavy, relationship-driven market
- Showcases the full catalogue of ~76 units across 4 training package sectors
- Communicates compliance confidence, not just "content"
- Generates inbound leads from RTO decision-makers

## 2. Brand Identity

- **Brand name:** StudyOracle
- **Domain:** studyoracle.com
- **CRITICAL:** The name "Oban College" must NEVER appear anywhere on the site — not in code, copy, metadata, alt text, comments, or configuration.

## 3. Functional Requirements

### F1: Homepage
- Hero section communicating the core value proposition: compliance confidence, trainer efficiency, audit readiness
- Trust signals: "Independently reviewed", "Mapped to training package requirements", "Validation-ready evidence pack included"
- Sector overview (CHC, BSB, RII/MEM)
- CTA to browse units or request a sample

### F2: Unit Catalogue
- Browse all ~76 units, filterable by sector/training package:
  - **CHC (Community Services):** ~45 units — Aged Care, Disability, Mental Health, Community Services, WHS, First Aid, Infection Control
  - **BSB (Business Services):** ~16 units — Leadership, Project Management, Communication, Critical Thinking, Innovation, Spreadsheets
  - **RII (Civil Construction Design):** ~12 units — Civil Design clusters, Technical Math, CAD, Quality Systems, Leadership
  - **MEM (Manufacturing/Engineering):** 2 units — Technical Math, CAD
  - **CPP (Building Design):** 1 unit — BIM
- Each unit should display: unit code, unit name, sector tag
- Individual unit pages are NOT required at launch — catalogue is a listing/grid

### F3: About / Trust Page
- Review process explanation (how materials are developed and validated)
- Reviewer credentials section (placeholder)
- Case studies section (placeholder)
- Testimonials section (placeholder)
- Safe compliance wording throughout (see constraints)

### F4: Contact / Lead Capture
- Contact form for RTO decision-makers to request samples or enquire
- Fields: Name, Organisation, Role, Email, Phone (optional), Message
- No payment or e-commerce functionality

### F5: SEO-Driven Content Structure
- Pages structured around qualification codes and unit codes for organic search
- Target searches like: "CHC33021 learning resources", "RTO assessment tools Australia", "ASQA compliant resources"

### F6: Legal Compliance
- Disclaimer: "Final contextualisation, validation and compliance remain the responsibility of each RTO"
- Privacy policy page (placeholder)
- Terms of use page (placeholder)

## 4. Non-Functional Constraints

### NF1: Technology Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **No backend/database required** — static/SSG marketing site with form submissions handled externally (e.g., Vercel serverless function → email, or a form service)

### NF2: Performance
- Lighthouse scores: 90+ across all categories
- Static generation for all catalogue pages
- Fast initial load — this is a marketing site, speed matters for SEO and first impressions

### NF3: SEO
- Semantic HTML, proper heading hierarchy
- OpenGraph and Twitter meta tags
- Structured data (JSON-LD) for organisation
- Sitemap and robots.txt

### NF4: Responsive Design
- Mobile-first responsive layout
- Primary audience uses desktop (RTO managers at work), but mobile must work well

### NF5: Accessibility
- WCAG 2.1 AA compliance
- Proper contrast ratios, keyboard navigation, ARIA labels

### NF6: Safe Marketing Language
Per ASQA compliance, the following wording rules apply:

| Use This | NEVER Use This |
|----------|----------------|
| Designed to support RTO compliance under the 2025 Standards for RTOs | ASQA approved |
| Independently reviewed by VET compliance specialists | Government certified |
| Mapped to training package requirements | Guaranteed compliant |
| Includes a validation-ready evidence pack | Audit-proof |
| Final contextualisation and validation remain the responsibility of each RTO | No RTO review required |

## 5. Known Boundaries

- **No e-commerce** — this is a lead-generation site, not a store
- **No user accounts or authentication** — no login, no dashboard
- **No CMS** — content is managed in code (units data can be a JSON/TS data file)
- **Placeholders only** for: testimonials, case studies, reviewer credentials, sample downloads
- **No blog at launch** — may be added later for authority content
- **Unit data is static** — sourced from the study-material-database directory at build time, not fetched from an API

## 6. Success Criteria

1. An RTO compliance manager landing on the site immediately understands what StudyOracle offers
2. They can browse the full unit catalogue and filter by sector
3. They can request a sample or contact sales via the form
4. The site ranks for targeted qualification code searches within 3-6 months
5. All copy uses safe compliance wording — zero instances of prohibited claims
