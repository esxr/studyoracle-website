import type { SectorId } from "@/lib/types";

const sectorStyles: Record<SectorId, string> = {
  "community-services": "bg-emerald-100 text-emerald-800",
  business: "bg-blue-100 text-blue-800",
  "engineering-construction": "bg-amber-100 text-amber-800",
};

interface SectorBadgeProps {
  sectorId: SectorId;
  label: string;
}

export default function SectorBadge({ sectorId, label }: SectorBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sectorStyles[sectorId]}`}
    >
      {label}
    </span>
  );
}
