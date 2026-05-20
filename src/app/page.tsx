import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import TrustSignals from "@/components/home/TrustSignals";
import SectorOverview from "@/components/home/SectorOverview";
import ValueProposition from "@/components/home/ValueProposition";
import TestimonialPlaceholder from "@/components/home/TestimonialPlaceholder";
import CTASection from "@/components/shared/CTASection";

export const metadata: Metadata = {
  title: "StudyOracle | VET Study Materials for RTOs",
  description:
    "Compliance-ready study materials for Australian RTOs. Independently reviewed resources mapped to training package requirements across Community Services, Business, and Engineering sectors.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSignals />
      <SectorOverview />
      <ValueProposition />
      <TestimonialPlaceholder />
      <CTASection
        headline="Ready to see the difference?"
        primaryAction={{ label: "Request a Free Sample", href: "/contact" }}
        secondaryAction={{ label: "Browse Catalogue", href: "/units" }}
      />
    </>
  );
}
