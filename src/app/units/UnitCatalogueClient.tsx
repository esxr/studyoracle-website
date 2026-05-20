"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { units } from "@/data/units";
import { SECTORS } from "@/lib/sectors";
import type { SectorId } from "@/lib/types";
import SectorFilter from "@/components/units/SectorFilter";
import SearchBar from "@/components/units/SearchBar";
import UnitGrid from "@/components/units/UnitGrid";
import UnitCard from "@/components/units/UnitCard";

// Compute sector counts
const sectorsWithCounts = SECTORS.map((sector) => ({
  ...sector,
  unitCount: units.filter((u) => u.sectorId === sector.id).length,
}));

export default function UnitCatalogueClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeSector, setActiveSector] = useState<SectorId | "all">(
    (searchParams.get("sector") as SectorId) || "all"
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );

  // Sync URL params
  const updateParams = useCallback(
    (sector: SectorId | "all", q: string) => {
      const params = new URLSearchParams();
      if (sector !== "all") params.set("sector", sector);
      if (q) params.set("q", q);
      const qs = params.toString();
      router.replace(qs ? `/units?${qs}` : "/units", { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    updateParams(activeSector, searchQuery);
  }, [activeSector, searchQuery, updateParams]);

  const filteredUnits = useMemo(() => {
    let result = units;

    if (activeSector !== "all") {
      result = result.filter((u) => u.sectorId === activeSector);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.code.toLowerCase().includes(q) ||
          u.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeSector, searchQuery]);

  return (
    <div className="space-y-6">
      <SectorFilter
        sectors={sectorsWithCounts}
        activeSector={activeSector}
        onSelect={setActiveSector}
        totalCount={units.length}
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by unit code or name..."
      />

      {filteredUnits.length > 0 ? (
        <UnitGrid>
          {filteredUnits.map((unit) => (
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
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
          <p className="text-lg font-medium text-slate-500">No units found</p>
          <p className="mt-2 text-sm text-slate-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      <p className="text-center text-sm text-slate-500">
        Showing {filteredUnits.length} of {units.length} units
      </p>
    </div>
  );
}
