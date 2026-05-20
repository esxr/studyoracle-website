/**
 * Build-time script: Reads course_list.json and generates src/data/units.ts
 * Run with: npx tsx scripts/generate-units.ts
 */

import * as fs from "fs";
import * as path from "path";

interface SourceCourse {
  id: number;
  fullname: string;
  shortname: string;
  category: string;
  url: string;
}

interface SourceCourseList {
  total: number;
  courses: SourceCourse[];
}

type DeliveryMode = "Classroom" | "Workplace";
type SectorId = "community-services" | "business" | "engineering-construction";
type TrainingPackagePrefix = "CHC" | "BSB" | "RII" | "MEM" | "CPP" | "HLT";

const PREFIX_TO_SECTOR: Record<string, SectorId> = {
  CHC: "community-services",
  BSB: "business",
  RII: "engineering-construction",
  MEM: "engineering-construction",
  CPP: "engineering-construction",
  HLT: "community-services",
  HLS: "community-services",
};

const SECTOR_LABELS: Record<SectorId, string> = {
  "community-services": "Community Services",
  business: "Business",
  "engineering-construction": "Engineering & Construction",
};

function extractUnitCode(shortname: string): string {
  // Handle cluster entries
  if (shortname.startsWith("RIICluster")) {
    return shortname.replace(/_RTOW$/, "");
  }

  // Remove _RTOW and everything after
  let code = shortname.replace(/_RTOW.*$/, "");

  // Remove delivery mode suffixes
  code = code
    .replace(/_CB_IS$/, "")
    .replace(/_WB_IS$/, "")
    .replace(/_CB$/, "")
    .replace(/_WB$/, "")
    .replace(/_RII$/, "");

  return code;
}

function getDeliveryModes(shortname: string): DeliveryMode[] {
  const modes: DeliveryMode[] = [];
  if (shortname.includes("_CB")) modes.push("Classroom");
  if (shortname.includes("_WB")) modes.push("Workplace");
  // Default: if no explicit mode, assume both
  if (modes.length === 0) {
    modes.push("Classroom", "Workplace");
  }
  return modes;
}

function getTrainingPackagePrefix(code: string): TrainingPackagePrefix {
  const prefix = code.substring(0, 3);
  if (["CHC", "BSB", "RII", "MEM", "CPP", "HLT"].includes(prefix)) {
    return prefix as TrainingPackagePrefix;
  }
  // Handle CPPBDN etc.
  if (code.startsWith("CPP")) return "CPP";
  if (code.startsWith("RII")) return "RII";
  if (code.startsWith("MEM")) return "MEM";
  if (code.startsWith("HLT") || code.startsWith("HLS")) return "HLT";
  return "BSB"; // fallback
}

function getSectorId(
  prefix: string,
  category: string,
  shortname: string
): SectorId {
  // BSB units with _RII suffix delivered in RII program
  if (prefix === "BSB" && shortname.includes("_RII")) {
    return "engineering-construction";
  }
  // Category-based override for RII RTOW
  if (category === "RII RTOW" && prefix === "BSB") {
    return "engineering-construction";
  }
  return PREFIX_TO_SECTOR[prefix] || "engineering-construction";
}

function cleanName(fullname: string): string {
  // Strip delivery mode info from name
  return fullname
    .replace(/\s*\(Classroom[- ]based\)\s*/i, "")
    .replace(/\s*\(Workplace[- ]based\)\s*/i, "")
    .replace(/\s*\(Classroom\)\s*/i, "")
    .replace(/\s*\(Workplace\)\s*/i, "")
    .replace(/\s+CHC33021$/i, "")
    .trim();
}

// Main pipeline
const sourcePath = path.resolve(
  __dirname,
  "../../study-material-database/course_list.json"
);
const outputPath = path.resolve(__dirname, "../src/data/units.ts");

console.log("Reading source data from:", sourcePath);
const raw = fs.readFileSync(sourcePath, "utf-8");
const parsed = JSON.parse(raw);
// Handle double-encoded JSON (file may contain a JSON string rather than object)
const data: SourceCourseList = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
console.log(`Found ${data.total} courses in source data`);

// Step 1: Filter out non-unit entries
const unitCourses = data.courses.filter(
  (c) => c.category !== "Support Centre"
);
console.log(`After filtering: ${unitCourses.length} unit entries`);

// Step 2: Process and deduplicate
interface UnitAccumulator {
  code: string;
  name: string;
  trainingPackage: TrainingPackagePrefix;
  sectorId: SectorId;
  sectorLabel: string;
  deliveryModes: Set<DeliveryMode>;
  isCluster: boolean;
  clusterUnits: string[];
}

const unitMap = new Map<string, UnitAccumulator>();

for (const course of unitCourses) {
  const code = extractUnitCode(course.shortname);
  const prefix = getTrainingPackagePrefix(code);
  const sectorId = getSectorId(prefix, course.category, course.shortname);
  const modes = getDeliveryModes(course.shortname);
  const name = cleanName(course.fullname);
  const isCluster = course.shortname.startsWith("RIICluster");

  if (unitMap.has(code)) {
    // Merge delivery modes
    const existing = unitMap.get(code)!;
    for (const mode of modes) {
      existing.deliveryModes.add(mode);
    }
  } else {
    unitMap.set(code, {
      code,
      name,
      trainingPackage: prefix,
      sectorId,
      sectorLabel: SECTOR_LABELS[sectorId],
      deliveryModes: new Set(modes),
      isCluster,
      clusterUnits: [],
    });
  }
}

// Step 3: Sort and build output
const units = Array.from(unitMap.values())
  .sort((a, b) => a.code.localeCompare(b.code))
  .map((u) => ({
    code: u.code,
    name: u.name,
    trainingPackage: u.trainingPackage,
    sectorId: u.sectorId,
    sectorLabel: u.sectorLabel,
    deliveryModes: Array.from(u.deliveryModes).sort() as DeliveryMode[],
    isCluster: u.isCluster,
    clusterUnits: u.clusterUnits,
  }));

console.log(`Deduplicated to ${units.length} unique units`);

// Count by sector
const sectorCounts: Record<string, number> = {};
for (const u of units) {
  sectorCounts[u.sectorId] = (sectorCounts[u.sectorId] || 0) + 1;
}
console.log("Sector counts:", sectorCounts);

// Step 4: Generate TypeScript output
const timestamp = new Date().toISOString();
const output = `// AUTO-GENERATED by scripts/generate-units.ts
// Do not edit manually. Regenerate with: npm run generate-units
// Source: study-material-database/course_list.json
// Generated: ${timestamp}

import type { Unit } from "@/lib/types";

export const units: Unit[] = ${JSON.stringify(units, null, 2)};

export const unitCount = ${units.length};

export const sectorCounts: Record<string, number> = ${JSON.stringify(sectorCounts, null, 2)};
`;

// Ensure output directory exists
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output, "utf-8");
console.log(`Wrote ${units.length} units to ${outputPath}`);
