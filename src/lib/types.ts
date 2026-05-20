/** Delivery mode for a unit of competency */
export type DeliveryMode = "Classroom" | "Workplace";

/** Mega-sector identifiers used for filtering */
export type SectorId = "community-services" | "business" | "engineering-construction";

/** Training package prefix codes from the source data */
export type TrainingPackagePrefix = "CHC" | "BSB" | "RII" | "MEM" | "CPP" | "HLT";

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

/** Navigation item for header/footer */
export interface NavItem {
  label: string;
  href: string;
}
