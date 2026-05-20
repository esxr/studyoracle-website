"use client";

import type { Sector, SectorId } from "@/lib/types";

interface SectorFilterProps {
  sectors: Sector[];
  activeSector: SectorId | "all";
  onSelect: (sector: SectorId | "all") => void;
  totalCount: number;
}

export default function SectorFilter({
  sectors,
  activeSector,
  onSelect,
  totalCount,
}: SectorFilterProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
      role="tablist"
      aria-label="Filter by sector"
    >
      <button
        role="tab"
        aria-selected={activeSector === "all"}
        onClick={() => onSelect("all")}
        className={`inline-flex flex-shrink-0 items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          activeSector === "all"
            ? "bg-deep-blue text-white"
            : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
        }`}
      >
        All ({totalCount})
      </button>
      {sectors.map((sector) => (
        <button
          key={sector.id}
          role="tab"
          aria-selected={activeSector === sector.id}
          onClick={() => onSelect(sector.id)}
          className={`inline-flex flex-shrink-0 items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeSector === sector.id
              ? "bg-deep-blue text-white"
              : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {sector.label} ({sector.unitCount})
        </button>
      ))}
    </div>
  );
}
