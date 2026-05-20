import type { NavItem } from "./types";

export const SITE_NAME = "StudyOracle";
export const SITE_URL = "https://studyoracle.com";
export const SITE_DESCRIPTION =
  "Compliance-ready study materials for Australian RTOs. Independently reviewed resources mapped to training package requirements.";
export const CONTACT_EMAIL = "hello@studyoracle.com";
export const SITE_TAGLINE = "VET Study Materials for RTOs";

export const NAV_ITEMS: NavItem[] = [
  { label: "Units", href: "/units" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS: NavItem[] = [
  { label: "Units", href: "/units" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

export const DISCLAIMER_TEXT =
  "Final contextualisation, validation and compliance remain the responsibility of each RTO.";
