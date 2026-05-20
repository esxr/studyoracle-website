# Implementation Specification: StudyOracle Marketing Website

**Version:** 1.0
**Date:** 2026-05-20
**Based on:** HLD v1.1, ADR-Lite v1.0

---

## 1. File/Directory Structure

```
website/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout: fonts, metadata, analytics, Header + Footer
│   │   ├── page.tsx                # Homepage (/)
│   │   ├── units/
│   │   │   └── page.tsx            # Unit Catalogue (/units)
│   │   ├── about/
│   │   │   └── page.tsx            # About / Trust (/about)
│   │   ├── contact/
│   │   │   └── page.tsx            # Contact form (/contact)
│   │   ├── privacy/
│   │   │   └── page.tsx            # Privacy policy (/privacy)
│   │   ├── terms/
│   │   │   └── page.tsx            # Terms of use (/terms)
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts        # POST /api/contact serverless function
│   │   ├── sitemap.ts              # Dynamic sitemap generation
│   │   └── robots.ts               # robots.txt generation
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Site header with navigation
│   │   │   ├── Footer.tsx          # Site footer with links, disclaimer, copyright
│   │   │   └── MobileMenu.tsx      # Mobile hamburger menu (slide-out)
│   │   ├── home/
│   │   │   ├── HeroSection.tsx     # Homepage hero with headline, subheadline, CTAs
│   │   │   ├── TrustSignals.tsx    # Trust badges row (approved wording only)
│   │   │   ├── SectorOverview.tsx  # Three mega-sector cards with unit counts
│   │   │   ├── ValueProposition.tsx # Feature highlight section
│   │   │   └── CTASection.tsx      # Bottom CTA block ("Browse Units" / "Request a Sample")
│   │   ├── units/
│   │   │   ├── UnitCard.tsx        # Individual unit display card
│   │   │   ├── UnitGrid.tsx        # Responsive grid of UnitCards
│   │   │   ├── SectorFilter.tsx    # Filter tabs/buttons for mega-sectors
│   │   │   └── SearchBar.tsx       # Text search input for unit code/name
│   │   ├── about/
│   │   │   ├── ReviewProcess.tsx   # How materials are developed section
│   │   │   ├── TestimonialPlaceholder.tsx  # Placeholder testimonial cards
│   │   │   └── CaseStudyPlaceholder.tsx    # Placeholder case study section
│   │   ├── contact/
│   │   │   └── ContactForm.tsx     # Lead capture form with validation
│   │   └── shared/
│   │       ├── TrustBadge.tsx      # Reusable trust badge (approved wording only)
│   │       ├── SectorBadge.tsx     # Coloured sector tag chip
│   │       ├── DeliveryModeBadge.tsx # Classroom/Workplace delivery mode chip
│   │       ├── Button.tsx          # Shared button component (primary/secondary/outline)
│   │       ├── Container.tsx       # Max-width centered container
│   │       └── JsonLd.tsx          # JSON-LD structured data injection
│   ├── data/
│   │   └── units.ts                # Generated: typed unit catalogue (build output)
│   ├── lib/
│   │   ├── constants.ts            # Site-wide constants (site name, URLs, nav items)
│   │   ├── types.ts                # Shared TypeScript type definitions
│   │   ├── sectors.ts              # Sector definitions, colours, mapping logic
│   │   ├── metadata.ts             # SEO metadata helper functions
│   │   └── validation.ts           # Form validation schemas (shared client/server)
│   └── styles/
│       └── globals.css             # Tailwind directives, CSS custom properties, base styles
├── public/
│   ├── favicon.svg                 # "SO" text-based placeholder favicon
│   ├── favicon.ico                 # ICO fallback generated from SVG
│   ├── apple-touch-icon.png        # 180x180 Apple touch icon
│   └── og-image.png               # 1200x630 OG placeholder image
├── scripts/
│   └── generate-units.ts           # Build-time script: course_list.json → units.ts
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS v4 configuration with theme tokens
├── tsconfig.json                   # TypeScript configuration (strict mode)
├── package.json                    # Dependencies and scripts
├── .env.example                    # Template for environment variables
├── .eslintrc.json                  # ESLint configuration
└── .prettierrc                     # Prettier configuration
```

---

## 2. Data Model

### 2.1 Core Types

Defined in `src/lib/types.ts`:

```typescript
/** Delivery mode for a unit of competency */
export type DeliveryMode = "Classroom" | "Workplace";

/** Mega-sector identifiers used for filtering */
export type SectorId = "community-services" | "business" | "engineering-construction";

/** Training package prefix codes from the source data */
export type TrainingPackagePrefix = "CHC" | "BSB" | "RII" | "MEM" | "CPP";

/**
 * A unit of competency in the catalogue.
 * Produced by the build-time script from course_list.json.
 */
export interface Unit {
  /** Unit code extracted from shortname, e.g. "CHCCOM005" */
  code: string;
  /** Human-readable unit name from fullname field */
  name: string;
  /** Training package prefix, e.g. "CHC", "BSB", "RII" */
  trainingPackage: TrainingPackagePrefix;
  /** Mega-sector ID for filtering */
  sectorId: SectorId;
  /** Display label for the mega-sector */
  sectorLabel: string;
  /** Delivery modes available for this unit */
  deliveryModes: DeliveryMode[];
  /** True if this is a cluster entry (e.g. RII Cluster 1-6) */
  isCluster: boolean;
  /** Unit codes contained in this cluster (only populated for cluster entries) */
  clusterUnits: string[];
}

/**
 * Sector definition for the filter UI and sector overview.
 */
export interface Sector {
  /** Unique sector identifier */
  id: SectorId;
  /** Display label, e.g. "Community Services" */
  label: string;
  /** Short description for sector overview cards */
  description: string;
  /** Number of deduplicated units in this sector */
  unitCount: number;
  /** Tailwind colour class for sector badges */
  colour: string;
  /** Training package prefixes included in this sector */
  prefixes: TrainingPackagePrefix[];
}

/**
 * Contact form submission data.
 * Validated on both client and server.
 */
export interface ContactFormData {
  /** Full name (required, 2-100 chars) */
  name: string;
  /** Organisation / RTO name (required, 2-200 chars) */
  organisation: string;
  /** Role / job title (required, 2-100 chars) */
  role: string;
  /** Email address (required, valid email format) */
  email: string;
  /** Phone number (optional, 8-20 chars if provided) */
  phone?: string;
  /** Message / enquiry (required, 10-2000 chars) */
  message: string;
  /** Honeypot field -- must be empty (anti-spam) */
  _honeypot?: string;
}

/**
 * API response for contact form submission.
 */
export interface ContactFormResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}
```

### 2.2 Sector Mapping Logic

Defined in `src/lib/sectors.ts`:

```typescript
import type { Sector, SectorId, TrainingPackagePrefix } from "./types";

/**
 * Maps a training package prefix to its mega-sector.
 * CHC → Community Services
 * BSB → Business
 * RII, MEM, CPP → Engineering & Construction
 */
export const PREFIX_TO_SECTOR: Record<TrainingPackagePrefix, SectorId> = {
  CHC: "community-services",
  BSB: "business",
  RII: "engineering-construction",
  MEM: "engineering-construction",
  CPP: "engineering-construction",
};

/**
 * Also handles HLT-prefixed units (e.g. HLTINF006, HLTAID011, HLTWHS002)
 * that appear in the CHC RTOW category.
 * Any prefix not in this map defaults to the category-based assignment.
 */
export const EXTENDED_PREFIX_TO_SECTOR: Record<string, SectorId> = {
  ...PREFIX_TO_SECTOR,
  HLT: "community-services",
};

export const SECTORS: Sector[] = [
  {
    id: "community-services",
    label: "Community Services",
    description:
      "Aged Care, Disability, Mental Health, Community Services, WHS, First Aid, Infection Control",
    unitCount: 0, // Computed at build time
    colour: "bg-emerald-100 text-emerald-800",
    prefixes: ["CHC"],
  },
  {
    id: "business",
    label: "Business",
    description:
      "Leadership, Project Management, Communication, Critical Thinking, Innovation, Spreadsheets",
    unitCount: 0,
    colour: "bg-blue-100 text-blue-800",
    prefixes: ["BSB"],
  },
  {
    id: "engineering-construction",
    label: "Engineering & Construction",
    description:
      "Civil Design Clusters, Technical Math, CAD, Quality Systems, BIM, Leadership",
    unitCount: 0,
    colour: "bg-amber-100 text-amber-800",
    prefixes: ["RII", "MEM", "CPP"],
  },
];
```

### 2.3 Source Data Shape

The input file `study-material-database/course_list.json` has this structure:

```typescript
interface SourceCourseList {
  total: number;
  courses: SourceCourse[];
}

interface SourceCourse {
  id: number;
  fullname: string;       // e.g. "Work legally and ethically (Classroom based)"
  shortname: string;      // e.g. "CHCLEG001_RTOW_CB"
  category: string;       // e.g. "CHC RTOW", "BSB RTOW", "RII RTOW"
  url: string;            // Internal LMS URL -- MUST be stripped, never exposed
}
```

---

## 3. Page Specifications

### 3.1 Homepage (`/`)

**Route:** `src/app/page.tsx`
**Rendering:** Static (SSG)

**SEO Metadata:**
```typescript
export const metadata: Metadata = {
  title: "StudyOracle | VET Study Materials for RTOs",
  description:
    "Compliance-ready study materials for Australian RTOs. Independently reviewed resources mapped to training package requirements across Community Services, Business, and Engineering sectors.",
  openGraph: {
    title: "StudyOracle | VET Study Materials for RTOs",
    description:
      "Compliance-ready study materials for Australian RTOs. Independently reviewed, mapped to training package requirements.",
    url: "https://studyoracle.com",
    siteName: "StudyOracle",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "StudyOracle" }],
    type: "website",
  },
};
```

**Component Tree:**
```
<HomePage>
  <HeroSection>
    Headline: "Compliance-Ready Study Materials for Australian RTOs"
    Subheadline: "Independently reviewed resources mapped to training package requirements.
                  Built for audit confidence."
    <Button href="/units">Browse Unit Catalogue</Button>
    <Button href="/contact" variant="outline">Request a Sample</Button>
  </HeroSection>

  <TrustSignals>
    <TrustBadge icon="shield">Designed to support RTO compliance under the 2025 Standards</TrustBadge>
    <TrustBadge icon="check">Independently reviewed by VET compliance specialists</TrustBadge>
    <TrustBadge icon="file">Includes a validation-ready evidence pack</TrustBadge>
    <TrustBadge icon="map">Mapped to training package requirements</TrustBadge>
  </TrustSignals>

  <SectorOverview>
    <!-- Three cards, one per mega-sector, showing name + description + unit count + link to /units?sector=X -->
    <SectorCard sector={communitySector} />
    <SectorCard sector={businessSector} />
    <SectorCard sector={engineeringSector} />
  </SectorOverview>

  <ValueProposition>
    Feature 1: "Audit-Ready Documentation" — Every unit includes a validation-ready evidence pack
    Feature 2: "Trainer Efficiency" — Reduce prep time with structured, ready-to-contextualise materials
    Feature 3: "Coverage You Can Trust" — Mapped to every performance criteria, knowledge evidence, and assessment requirement
  </ValueProposition>

  <TestimonialPlaceholder />

  <CTASection>
    Headline: "Ready to see the difference?"
    <Button href="/contact">Request a Free Sample</Button>
    <Button href="/units" variant="outline">Browse Catalogue</Button>
  </CTASection>
</HomePage>
```

**Data Dependencies:** `units.ts` (for sector unit counts in SectorOverview)

---

### 3.2 Unit Catalogue (`/units`)

**Route:** `src/app/units/page.tsx`
**Rendering:** Static (SSG) with client-side interactivity for filtering

**SEO Metadata:**
```typescript
export const metadata: Metadata = {
  title: "Unit Catalogue | StudyOracle",
  description:
    "Browse 50+ VET units of competency across Community Services, Business, and Engineering & Construction. Filter by sector, search by unit code or name.",
  openGraph: {
    title: "Unit Catalogue | StudyOracle",
    description: "Browse VET study materials across Community Services, Business, and Engineering sectors.",
    url: "https://studyoracle.com/units",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "StudyOracle Unit Catalogue" }],
  },
};
```

**Component Tree:**
```
<UnitsPage>
  <PageHeader>
    Headline: "Unit Catalogue"
    Subheadline: "Browse our complete range of VET study materials"
  </PageHeader>

  <UnitCatalogueClient>          <!-- "use client" boundary -->
    <SectorFilter
      sectors={SECTORS}
      activeSector={selectedSector}   // from URL search param or state
      onSelect={setSector}
    />

    <SearchBar
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder="Search by unit code or name..."
    />

    <UnitGrid>
      {filteredUnits.map(unit => (
        <UnitCard
          key={unit.code}
          code={unit.code}
          name={unit.name}
          sectorId={unit.sectorId}
          sectorLabel={unit.sectorLabel}
          deliveryModes={unit.deliveryModes}
          isCluster={unit.isCluster}
          clusterUnits={unit.clusterUnits}
        />
      ))}
    </UnitGrid>

    <NoResults />                 <!-- Shown when filter/search yields 0 results -->
  </UnitCatalogueClient>
</UnitsPage>
```

**Data Dependencies:** `units.ts` (full unit array), `sectors.ts` (sector definitions)
**Client-Side Logic:**
- Filter by `sectorId` when a sector tab is active
- Filter by search query matching `code` or `name` (case-insensitive substring)
- URL search params sync: `?sector=community-services&q=aged` for shareable filter state
- "All" tab shows all units (default)

---

### 3.3 About / Trust (`/about`)

**Route:** `src/app/about/page.tsx`
**Rendering:** Static (SSG)

**SEO Metadata:**
```typescript
export const metadata: Metadata = {
  title: "About Our Review Process | StudyOracle",
  description:
    "Learn how StudyOracle study materials are developed, independently reviewed, and mapped to training package requirements. Built for RTO compliance confidence.",
  openGraph: {
    title: "About Our Review Process | StudyOracle",
    description: "How StudyOracle materials are developed and validated for RTO compliance.",
    url: "https://studyoracle.com/about",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "StudyOracle About" }],
  },
};
```

**Component Tree:**
```
<AboutPage>
  <PageHeader>
    Headline: "Built for Compliance Confidence"
    Subheadline: "How our study materials are developed, reviewed, and validated"
  </PageHeader>

  <ReviewProcess>
    Step 1: "Training Package Analysis" — Every unit mapped to its performance criteria
    Step 2: "Content Development" — Written by subject matter experts
    Step 3: "Independent Review" — Reviewed by VET compliance specialists
    Step 4: "Evidence Pack Assembly" — Validation-ready documentation included
  </ReviewProcess>

  <ReviewerCredentials>           <!-- PLACEHOLDER -->
    "Our review team includes qualified VET practitioners and compliance specialists.
     Detailed credentials will be published here."
  </ReviewerCredentials>

  <TestimonialPlaceholder />      <!-- PLACEHOLDER: greyed cards with "Coming soon" -->

  <CaseStudyPlaceholder />        <!-- PLACEHOLDER -->

  <CTASection>
    Headline: "Questions about our process?"
    <Button href="/contact">Get in Touch</Button>
  </CTASection>
</AboutPage>
```

**Data Dependencies:** None (static content)

---

### 3.4 Contact (`/contact`)

**Route:** `src/app/contact/page.tsx`
**Rendering:** Static (SSG) with client-side form interactivity

**SEO Metadata:**
```typescript
export const metadata: Metadata = {
  title: "Contact Us | StudyOracle",
  description:
    "Request a free sample or enquire about VET study materials for your RTO. Contact the StudyOracle team.",
  openGraph: {
    title: "Contact Us | StudyOracle",
    description: "Request a free sample or enquire about study materials for your RTO.",
    url: "https://studyoracle.com/contact",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact StudyOracle" }],
  },
};
```

**Component Tree:**
```
<ContactPage>
  <PageHeader>
    Headline: "Get in Touch"
    Subheadline: "Request a sample, ask a question, or discuss your RTO's needs"
  </PageHeader>

  <ContactForm>                    <!-- "use client" boundary -->
    <input name="name" required />
    <input name="organisation" required />
    <input name="role" required />
    <input name="email" type="email" required />
    <input name="phone" type="tel" />   <!-- optional -->
    <textarea name="message" required />
    <input name="_honeypot" type="hidden" tabIndex={-1} />  <!-- anti-spam -->
    <Button type="submit">Send Message</Button>

    <SuccessMessage />             <!-- Shown on successful submission -->
    <ErrorMessage />               <!-- Shown on validation/server error -->
  </ContactForm>

  <ContactInfo>
    Email: hello@studyoracle.com
    "We typically respond within one business day."
  </ContactInfo>
</ContactPage>
```

**Data Dependencies:** None
**Client-Side Logic:**
- Client-side validation before submission (using validation schema from `lib/validation.ts`)
- Submits POST to `/api/contact`
- Shows loading state during submission
- Displays success message or field-level error messages on response

---

### 3.5 Privacy Policy (`/privacy`)

**Route:** `src/app/privacy/page.tsx`
**Rendering:** Static (SSG)

**SEO Metadata:**
```typescript
export const metadata: Metadata = {
  title: "Privacy Policy | StudyOracle",
  description: "StudyOracle's privacy policy. How we collect, use, and protect your information.",
};
```

**Content:** Placeholder privacy policy covering:
- Information collection (contact form data only)
- Use of information (responding to enquiries)
- Analytics (Vercel Analytics -- no cookies, no personal data)
- Data retention
- Contact for privacy enquiries

---

### 3.6 Terms of Use (`/terms`)

**Route:** `src/app/terms/page.tsx`
**Rendering:** Static (SSG)

**SEO Metadata:**
```typescript
export const metadata: Metadata = {
  title: "Terms of Use | StudyOracle",
  description: "StudyOracle website terms of use.",
};
```

**Content:** Placeholder terms covering:
- Website use conditions
- Intellectual property
- Disclaimer: "Final contextualisation, validation and compliance remain the responsibility of each RTO"
- Limitation of liability
- Governing law (Australian)

---

## 4. Component Specifications

### 4.1 Header (`src/components/layout/Header.tsx`)

**Props:** None (reads nav items from constants)

**Behaviour:**
- Fixed/sticky at top of viewport
- Logo (text "StudyOracle" until brand assets arrive) links to `/`
- Desktop: horizontal nav links -- Units, About, Contact
- Mobile (< 768px): hamburger icon triggers `MobileMenu` slide-out
- Active link indicated by underline or colour change
- Background becomes opaque/blurred on scroll (subtle glass effect via Tailwind backdrop-blur)

**Navigation Items** (from `lib/constants.ts`):
```typescript
export const NAV_ITEMS = [
  { label: "Units", href: "/units" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
```

### 4.2 Footer (`src/components/layout/Footer.tsx`)

**Props:** None

**Sections:**
1. **Brand column:** "StudyOracle" text logo, one-line tagline
2. **Quick links:** Units, About, Contact, Privacy, Terms
3. **Disclaimer:** "Final contextualisation, validation and compliance remain the responsibility of each RTO."
4. **Copyright:** "(c) 2026 StudyOracle. All rights reserved."

**Behaviour:** Static content, responsive grid (3 columns desktop, stacked mobile)

### 4.3 UnitCard (`src/components/units/UnitCard.tsx`)

**Props:**
```typescript
interface UnitCardProps {
  code: string;
  name: string;
  sectorId: SectorId;
  sectorLabel: string;
  deliveryModes: DeliveryMode[];
  isCluster: boolean;
  clusterUnits: string[];
}
```

**Rendering:**
- Card with subtle border and hover shadow
- Top: `<SectorBadge>` with sector colour
- Middle: Unit code (bold, monospace), unit name below
- Bottom row: `<DeliveryModeBadge>` chips for each delivery mode
- If `isCluster`: expandable "Contains: CODE1, CODE2, ..." section below the name
- Semantic: `<article>` element with `aria-label` set to unit code + name

### 4.4 SectorFilter (`src/components/units/SectorFilter.tsx`)

**Props:**
```typescript
interface SectorFilterProps {
  sectors: Sector[];
  activeSector: SectorId | "all";
  onSelect: (sector: SectorId | "all") => void;
}
```

**Rendering:**
- Horizontal row of filter buttons: "All (N)", "Community Services (N)", "Business (N)", "Engineering & Construction (N)"
- Active button has filled background in sector colour; inactive buttons have outline style
- Unit counts displayed in parentheses
- Scrollable on mobile (horizontal overflow with snap)
- `role="tablist"` with `role="tab"` on each button for accessibility

### 4.5 ContactForm (`src/components/contact/ContactForm.tsx`)

**Props:** None

**State:**
```typescript
type FormState = "idle" | "submitting" | "success" | "error";
```

**Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | text | Yes | 2-100 chars |
| organisation | text | Yes | 2-200 chars |
| role | text | Yes | 2-100 chars |
| email | email | Yes | Valid email format |
| phone | tel | No | 8-20 chars if provided |
| message | textarea | Yes | 10-2000 chars |
| _honeypot | hidden | No | Must be empty |

**Behaviour:**
- Client-side validation on blur and on submit
- Inline error messages below each field
- Submit button disabled while `formState === "submitting"`
- On success: hide form, show success message with "Send another" option
- On error: show error message, re-enable form
- Honeypot field is hidden via CSS (`opacity: 0; position: absolute; pointer-events: none`), not `display: none` (bots detect that)

### 4.6 TrustBadge (`src/components/shared/TrustBadge.tsx`)

**Props:**
```typescript
interface TrustBadgeProps {
  icon: "shield" | "check" | "file" | "map";
  children: string;  // Approved copy text ONLY
}
```

**Rendering:** Icon + text in a card/pill layout. Only accepts pre-approved copy strings as children. The component does not generate or modify the text.

### 4.7 CTASection (`src/components/shared/CTASection.tsx`)

**Props:**
```typescript
interface CTASectionProps {
  headline: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}
```

**Rendering:** Full-width section with deep blue background, white headline text, and one or two action buttons centered below.

---

## 5. API Contract

### POST `/api/contact`

**Description:** Receives contact form submissions, validates input, sends email notification via Resend, and returns a success/error response.

**Authentication:** None (public endpoint)

**Rate Limiting:** Maximum 5 submissions per IP address per 15-minute window. Implemented via in-memory store (acceptable for Vercel serverless -- function instances share no state, so this is per-instance rate limiting; sufficient for basic spam prevention).

**Request:**
```json
{
  "name": "string — Full name (required, 2-100 chars)",
  "organisation": "string — Organisation name (required, 2-200 chars)",
  "role": "string — Job title (required, 2-100 chars)",
  "email": "string — Email address (required, valid format)",
  "phone": "string | undefined — Phone number (optional, 8-20 chars)",
  "message": "string — Enquiry message (required, 10-2000 chars)",
  "_honeypot": "string | undefined — Must be empty or absent"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Thank you for your enquiry. We'll be in touch within one business day."
}
```

**Error Responses:**

| Status | Code | Description | When |
|--------|------|-------------|------|
| 400 | `VALIDATION_ERROR` | Input validation failed | Missing required fields, invalid email, field length violations |
| 400 | `SPAM_DETECTED` | Honeypot triggered | `_honeypot` field is non-empty (returns 200 to the client to avoid tipping off bots, but does not send email) |
| 405 | `METHOD_NOT_ALLOWED` | Wrong HTTP method | Request is not POST |
| 429 | `RATE_LIMITED` | Too many requests | More than 5 submissions from the same IP in 15 minutes |
| 500 | `SERVER_ERROR` | Internal error | Resend API failure or unexpected error |

**Spam handling note:** When the honeypot field is non-empty, the endpoint returns a 200 with `{ success: true }` to avoid revealing the spam detection mechanism. No email is sent.

**Implementation:**
```typescript
// src/app/api/contact/route.ts
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "hello@studyoracle.com";

export async function POST(request: NextRequest) {
  // 1. Parse and validate request body
  // 2. Check honeypot -- if filled, return fake success (200)
  // 3. Check rate limit
  // 4. Send email via Resend
  // 5. Return success or error response
}
```

**Email Template:**
- **From:** "StudyOracle Website" <noreply@studyoracle.com>
- **To:** Value of `CONTACT_EMAIL` env var
- **Reply-To:** The submitter's email address
- **Subject:** `New enquiry from {name} at {organisation}`
- **Body:** Plain text with all form fields formatted as key-value pairs

**Environment Variables Required:**
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RESEND_API_KEY` | Yes | -- | Resend API key for email delivery |
| `CONTACT_EMAIL` | No | hello@studyoracle.com | Recipient email address |

---

## 6. Build-Time Data Pipeline

### 6.1 Script: `scripts/generate-units.ts`

**Purpose:** Reads `course_list.json` from the study-material-database, processes it into a typed TypeScript array, and writes `src/data/units.ts`.

**Invocation:** `npx tsx scripts/generate-units.ts`
Added to `package.json` scripts:
```json
{
  "scripts": {
    "generate-units": "tsx scripts/generate-units.ts",
    "prebuild": "npm run generate-units",
    "build": "next build",
    "dev": "next dev"
  }
}
```

### 6.2 Input Format

File: `../study-material-database/course_list.json`

```json
{
  "total": 76,
  "courses": [
    {
      "id": 332,
      "fullname": "Apply basic principles and practices of infection prevention and control",
      "shortname": "HLTINF006_RTOW",
      "category": "CHC RTOW",
      "url": "https://oban.dlrlms.didasko-online.com/course/view.php?id=332"
    }
  ]
}
```

### 6.3 Processing Steps

1. **Read and parse** `course_list.json`
2. **Filter out non-unit entries** -- Exclude entries where `category` is "Support Centre" (e.g. `DLR_M3`)
3. **Extract unit code** from `shortname`:
   - For standard units: extract the code before `_RTOW` (e.g. `CHCCOM005_RTOW` -> `CHCCOM005`)
   - Strip delivery mode suffixes: `_CB`, `_WB`, `_CB_IS`, `_WB_IS`
   - Strip sector cross-reference suffixes: `_RII`
   - For cluster entries: extract as-is (e.g. `RIICluster1_RTOW` -> `RIICluster1`)
4. **Derive training package prefix**: first 3 characters of the unit code (CHC, BSB, RII, MEM, CPP, HLT). HLT-prefixed units are mapped to CHC mega-sector.
5. **Map to mega-sector** using `PREFIX_TO_SECTOR` and `EXTENDED_PREFIX_TO_SECTOR`
6. **Detect delivery modes**: if `shortname` contains `_CB`, add "Classroom"; if `_WB`, add "Workplace"; if neither, add both (default assumption)
7. **Deduplicate by unit code**: group all entries with the same extracted unit code, merge their delivery modes into a single array
8. **Identify cluster entries**: entries where `shortname` starts with `RIICluster` are marked as clusters
9. **Strip all URLs**: the `url` field from source data is NEVER included in the output
10. **Strip internal references**: any string containing "oban", "dlrlms", "didasko", or internal domain patterns is excluded
11. **Sort**: alphabetically by unit code
12. **Write output** to `src/data/units.ts`

### 6.4 Unit Code Extraction Rules

```typescript
function extractUnitCode(shortname: string): string {
  // Remove _RTOW and everything after delivery mode suffixes
  let code = shortname
    .replace(/_RTOW.*$/, "")  // Remove _RTOW and any suffix
    .replace(/_CB_IS$/, "")
    .replace(/_WB_IS$/, "")
    .replace(/_CB$/, "")
    .replace(/_WB$/, "")
    .replace(/_RII$/, "");    // Remove cross-reference suffix

  // Handle cluster entries
  if (shortname.startsWith("RIICluster")) {
    code = shortname.replace(/_RTOW$/, "");
  }

  return code;
}
```

### 6.5 Sector Mapping Rules

| Source `category` | Source `shortname` prefix | Mega-Sector | Sector ID |
|---|---|---|---|
| "CHC RTOW" | CHC*, HLT*, HLS* | Community Services | `community-services` |
| "BSB RTOW" | BSB* | Business | `business` |
| "RII RTOW" | RII*, RIIC*, RIIL*, RIIQ* | Engineering & Construction | `engineering-construction` |
| "RII RTOW" | MEM* | Engineering & Construction | `engineering-construction` |
| "RII RTOW" | CPP* | Engineering & Construction | `engineering-construction` |
| "RII RTOW" | BSB* (with _RII suffix) | Engineering & Construction | `engineering-construction` |
| "Support Centre" | DLR_M3 | **EXCLUDED** | -- |

**Note:** BSB units with `_RII` suffix (e.g. `BSBWHS616_RTOW_RII`, `BSBSTR601_RTOW_RII`) are categorised as "RII RTOW" in the source data. These are mapped to Engineering & Construction because they are delivered as part of the RII program, not the standalone BSB catalogue.

### 6.6 Output Format

File: `src/data/units.ts`

```typescript
// AUTO-GENERATED by scripts/generate-units.ts
// Do not edit manually. Regenerate with: npm run generate-units
// Source: study-material-database/course_list.json
// Generated: 2026-05-20T10:00:00.000Z

import type { Unit } from "@/lib/types";

export const units: Unit[] = [
  {
    code: "BSBCMM511",
    name: "Communicate with influence",
    trainingPackage: "BSB",
    sectorId: "business",
    sectorLabel: "Business",
    deliveryModes: ["Classroom", "Workplace"],
    isCluster: false,
    clusterUnits: [],
  },
  // ... remaining units
];

export const unitCount = units.length;
```

---

## 7. SEO Specification

### 7.1 Per-Page Title and Description Templates

| Page | Title | Description |
|------|-------|-------------|
| `/` | StudyOracle \| VET Study Materials for RTOs | Compliance-ready study materials for Australian RTOs. Independently reviewed resources mapped to training package requirements across Community Services, Business, and Engineering sectors. |
| `/units` | Unit Catalogue \| StudyOracle | Browse 50+ VET units of competency across Community Services, Business, and Engineering & Construction. Filter by sector, search by unit code or name. |
| `/about` | About Our Review Process \| StudyOracle | Learn how StudyOracle study materials are developed, independently reviewed, and mapped to training package requirements. Built for RTO compliance confidence. |
| `/contact` | Contact Us \| StudyOracle | Request a free sample or enquire about VET study materials for your RTO. Contact the StudyOracle team. |
| `/privacy` | Privacy Policy \| StudyOracle | StudyOracle's privacy policy. How we collect, use, and protect your information. |
| `/terms` | Terms of Use \| StudyOracle | StudyOracle website terms of use. |

### 7.2 JSON-LD Organisation Schema

Injected in root layout via `<JsonLd>` component:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "StudyOracle",
  "url": "https://studyoracle.com",
  "logo": "https://studyoracle.com/og-image.png",
  "description": "Compliance-ready VET study materials for Australian RTOs",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "email": "hello@studyoracle.com",
    "url": "https://studyoracle.com/contact"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Australia"
  },
  "sameAs": []
}
```

### 7.3 Sitemap Configuration

File: `src/app/sitemap.ts`

```typescript
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://studyoracle.com";

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
    { url: `${baseUrl}/units`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
```

### 7.4 robots.txt

File: `src/app/robots.ts`

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://studyoracle.com/sitemap.xml",
  };
}
```

### 7.5 OpenGraph Image Strategy

- **Default OG image:** `public/og-image.png` (1200x630), text-based "SO" mark on deep blue (#1e3a5f) background with tagline "VET Study Materials for RTOs" (see ADR-012)
- All pages reference this image via the root layout's default `openGraph.images` metadata
- Individual pages can override if needed (none do at launch)
- When brand assets arrive, replace `public/og-image.png` -- no code changes required

---

## 8. Traceability Matrix

| Requirement (Intent) | HLD Section | ADR | EIS Section | Test Category |
|---|---|---|---|---|
| **F1: Homepage** (hero, trust signals, sector overview, CTA) | 3 (Homepage component), 6 (KD5) | -- | 3.1 (Page spec), 4.1-4.7 (Components) | visual_regression, accessibility |
| **F2: Unit Catalogue** (filterable grid, sector filter, unit display) | 3 (Unit Catalogue), 4.1 (Data flow), 6 (KD2, KD3, KD4) | ADR-001 (no unit pages), ADR-002 (clusters), ADR-003 (delivery modes), ADR-009 (mega-sectors) | 2.1 (Unit type), 3.2 (Page spec), 4.3-4.4 (UnitCard, SectorFilter), 6 (Data pipeline) | data_pipeline, filtering_logic, accessibility |
| **F3: About / Trust Page** | 3 (About/Trust) | -- | 3.3 (Page spec) | visual_regression, copy_compliance |
| **F4: Contact / Lead Capture** (form with fields) | 3 (Contact), 4.2 (Form flow), 6 (KD6) | ADR-004 (Vercel + Resend), ADR-010 (recipient) | 2.1 (ContactFormData type), 3.4 (Page spec), 4.5 (ContactForm), 5 (API contract) | form_validation, api_contract, email_delivery |
| **F5: SEO-Driven Content** | 5 (Structured data, sitemap), 6 (KD3) | ADR-001 (no unit pages at launch) | 7 (SEO spec) | seo_metadata, structured_data, sitemap |
| **F6: Legal Compliance** (disclaimer, privacy, terms) | 3 (Privacy/Terms), 6 (KD5) | -- | 3.5-3.6 (Page specs), 4.2 (Footer disclaimer) | copy_compliance |
| **NF1: Technology Stack** (Next.js, Tailwind, Vercel) | 5 (Tech choices) | -- | 1 (Directory structure), all sections | build_verification |
| **NF2: Performance** (Lighthouse 90+, SSG) | 5 (SSG, fonts), 6 (KD1, KD7) | ADR-005 (Vercel Analytics), ADR-007 (fonts) | 7 (SEO spec -- font loading) | lighthouse_ci |
| **NF3: SEO** (semantic HTML, OG, structured data, sitemap) | 5 (JSON-LD, sitemap), 3 (Shared Layout) | ADR-012 (OG image) | 7.1-7.5 (Full SEO spec) | seo_metadata, structured_data |
| **NF4: Responsive Design** (mobile-first) | 5 (Tailwind) | -- | 4.1-4.5 (All component specs note mobile behaviour) | responsive_testing |
| **NF5: Accessibility** (WCAG 2.1 AA) | 5 (Semantic HTML), 8 (Accessibility risk) | -- | 4.4 (SectorFilter ARIA), 4.3 (UnitCard aria-label) | axe_core_ci, keyboard_nav |
| **NF6: Safe Marketing Language** (approved/prohibited) | 6 (KD5), 8 (Prohibited claims risk) | -- | 4.6 (TrustBadge -- approved wording only) | copy_compliance_lint |
| **Brand Safety: No "Oban College"** | 8 (Brand leak risk) | -- | 6.3 step 10 (strip internal references) | ci_grep_check |
| **Form handling choice** | 5 (Tech choices), 6 (KD6) | ADR-004 | 5 (API contract) | api_contract |
| **Analytics choice** | 5 (Tech choices) | ADR-005 | -- (zero config) | build_verification |
| **Colour palette** | 5 (Tech choices) | ADR-006 | 1 (tailwind.config.ts) | visual_regression |
| **Font choice** | 5 (Tech choices), 6 (KD7) | ADR-007 | 7 (SEO spec -- font loading) | lighthouse_ci |
| **Blog at launch** | 2 (NG5) | ADR-008 | -- (not implemented) | -- |
| **Sector grouping** | 7 (resolved) | ADR-009 | 2.2 (Sector mapping), 6.5 (Mapping rules) | data_pipeline |
| **Contact email** | 7 (resolved) | ADR-010 | 5 (API contract -- env vars) | api_contract |
| **Domain/DNS** | 7 (resolved) | ADR-011 | -- (implementation checklist) | deployment_verification |
| **Favicon/OG image** | 7 (resolved) | ADR-012 | 1 (public/ assets), 7.5 (OG strategy) | seo_metadata |
