import type { Sector, SectorId, TrainingPackagePrefix } from "./types";

/**
 * Maps a training package prefix to its mega-sector.
 * CHC -> Community Services
 * BSB -> Business
 * RII, MEM, CPP -> Engineering & Construction
 */
export const PREFIX_TO_SECTOR: Record<TrainingPackagePrefix, SectorId> = {
  CHC: "community-services",
  BSB: "business",
  RII: "engineering-construction",
  MEM: "engineering-construction",
  CPP: "engineering-construction",
  HLT: "community-services",
};

/**
 * Also handles HLT-prefixed units (e.g. HLTINF006, HLTAID011, HLTWHS002)
 * that appear in the CHC RTOW category.
 * Any prefix not in this map defaults to the category-based assignment.
 */
export const EXTENDED_PREFIX_TO_SECTOR: Record<string, SectorId> = {
  ...PREFIX_TO_SECTOR,
  HLT: "community-services",
  HLS: "community-services",
};

export const SECTOR_LABELS: Record<SectorId, string> = {
  "community-services": "Community Services",
  business: "Business",
  "engineering-construction": "Engineering & Construction",
};

export const SECTORS: Sector[] = [
  {
    id: "community-services",
    label: "Community Services",
    description:
      "Aged Care, Disability, Mental Health, Community Services, WHS, First Aid, Infection Control",
    unitCount: 0, // Computed at build time
    colour: "bg-emerald-100 text-emerald-800",
    prefixes: ["CHC", "HLT"],
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

export function getSectorById(id: SectorId): Sector | undefined {
  return SECTORS.find((s) => s.id === id);
}

export function getSectorForPrefix(prefix: string): SectorId {
  return (
    EXTENDED_PREFIX_TO_SECTOR[prefix] ||
    PREFIX_TO_SECTOR[prefix as TrainingPackagePrefix] ||
    "engineering-construction"
  );
}
