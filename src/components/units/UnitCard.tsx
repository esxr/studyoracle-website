"use client";

import { useState } from "react";
import type { DeliveryMode, SectorId } from "@/lib/types";
import SectorBadge from "@/components/shared/SectorBadge";
import DeliveryModeBadge from "@/components/shared/DeliveryModeBadge";

interface UnitCardProps {
  code: string;
  name: string;
  sectorId: SectorId;
  sectorLabel: string;
  deliveryModes: DeliveryMode[];
  isCluster: boolean;
  clusterUnits: string[];
}

export default function UnitCard({
  code,
  name,
  sectorId,
  sectorLabel,
  deliveryModes,
  isCluster,
  clusterUnits,
}: UnitCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
      aria-label={`${code} ${name}`}
    >
      <div className="flex items-start justify-between gap-2">
        <SectorBadge sectorId={sectorId} label={sectorLabel} />
        {isCluster && (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            Cluster
          </span>
        )}
      </div>

      <div className="mt-3 flex-1">
        <p className="font-mono text-sm font-bold text-deep-blue">{code}</p>
        <h3 className="mt-1 text-sm font-medium text-slate-900">{name}</h3>
      </div>

      {isCluster && clusterUnits.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium text-deep-blue hover:underline"
            aria-expanded={expanded}
          >
            {expanded ? "Hide" : "Show"} contained units ({clusterUnits.length})
          </button>
          {expanded && (
            <p className="mt-2 font-mono text-xs text-slate-500">
              {clusterUnits.join(", ")}
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {deliveryModes.map((mode) => (
          <DeliveryModeBadge key={mode} mode={mode} />
        ))}
      </div>
    </article>
  );
}
