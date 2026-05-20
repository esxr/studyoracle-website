import type { Metadata } from "next";
import Container from "@/components/shared/Container";
import ReviewProcess from "@/components/about/ReviewProcess";
import AboutTestimonialPlaceholder from "@/components/about/TestimonialPlaceholder";
import CaseStudyPlaceholder from "@/components/about/CaseStudyPlaceholder";
import CTASection from "@/components/shared/CTASection";

export const metadata: Metadata = {
  title: "About Our Review Process",
  description:
    "Learn how StudyOracle study materials are developed, independently reviewed, and mapped to training package requirements. Built for RTO compliance confidence.",
  openGraph: {
    title: "About Our Review Process | StudyOracle",
    description:
      "How StudyOracle materials are developed and validated for RTO compliance.",
    url: "https://studyoracle.com/about",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StudyOracle About",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <div className="pt-24 pb-8">
        <Container className="text-center">
          <h1 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
            Built for Compliance Confidence
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            How our study materials are developed, reviewed, and validated
          </p>
        </Container>
      </div>

      <ReviewProcess />

      <section className="bg-slate-50 py-16 sm:py-20">
        <Container>
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              Reviewer Credentials
            </h2>
            <p className="mt-4 text-slate-600">
              Our review team includes qualified VET practitioners and compliance specialists
              with extensive experience across the Australian vocational education sector.
              Detailed credentials will be published here.
            </p>
          </div>
        </Container>
      </section>

      <AboutTestimonialPlaceholder />
      <CaseStudyPlaceholder />

      <CTASection
        headline="Questions about our process?"
        primaryAction={{ label: "Get in Touch", href: "/contact" }}
      />
    </>
  );
}
