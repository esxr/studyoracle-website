import { Suspense } from "react";
import type { Metadata } from "next";
import Container from "@/components/shared/Container";
import UnitCatalogueClient from "./UnitCatalogueClient";

export const metadata: Metadata = {
  title: "Unit Catalogue",
  description:
    "Browse 50+ VET units of competency across Community Services, Business, and Engineering & Construction. Filter by sector, search by unit code or name.",
  openGraph: {
    title: "Unit Catalogue | StudyOracle",
    description:
      "Browse VET study materials across Community Services, Business, and Engineering sectors.",
    url: "https://studyoracle.com/units",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StudyOracle Unit Catalogue",
      },
    ],
  },
};

export default function UnitsPage() {
  return (
    <div className="pt-24 pb-16">
      <Container>
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
            Unit Catalogue
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Browse our complete range of VET study materials
          </p>
        </div>
        <div className="mt-10">
          <Suspense
            fallback={
              <div className="py-12 text-center text-slate-500">
                Loading units...
              </div>
            }
          >
            <UnitCatalogueClient />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
