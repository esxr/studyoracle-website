import Link from "next/link";
import Container from "@/components/shared/Container";
import { SECTORS } from "@/lib/sectors";
import { units } from "@/data/units";
import type { SectorId } from "@/lib/types";

function countBySector(sectorId: SectorId): number {
  return units.filter((u) => u.sectorId === sectorId).length;
}

const sectorIcons: Record<SectorId, React.ReactNode> = {
  "community-services": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  business: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  "engineering-construction": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384-3.108A2.25 2.25 0 014.802 9.4l.008-.033a2.25 2.25 0 012.723-1.579l3.284.758a.25.25 0 00.283-.163l.884-3.08a2.25 2.25 0 014.248-.034l.893 3.08a.25.25 0 00.283.163l3.284-.758a2.25 2.25 0 012.723 1.579l.008.033a2.25 2.25 0 01-1.234 2.662L16.58 15.17a2.25 2.25 0 00-1.16 1.97v1.11a2.25 2.25 0 01-2.25 2.25h-2.34a2.25 2.25 0 01-2.25-2.25v-1.11a2.25 2.25 0 00-1.16-1.97z" />
    </svg>
  ),
};

export default function SectorOverview() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
            Three Sectors, One Standard of Quality
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Study materials developed for the training packages your RTO delivers.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((sector) => {
            const count = countBySector(sector.id);
            return (
              <Link
                key={sector.id}
                href={`/units?sector=${sector.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
              >
                <div className={`inline-flex rounded-xl p-3 ${sector.colour}`}>
                  {sectorIcons[sector.id]}
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold text-slate-900 group-hover:text-deep-blue">
                  {sector.label}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {sector.description}
                </p>
                <p className="mt-4 text-sm font-medium text-deep-blue">
                  {count} unit{count !== 1 ? "s" : ""} available &rarr;
                </p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
