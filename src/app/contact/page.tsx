import type { Metadata } from "next";
import Container from "@/components/shared/Container";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Request a free sample or enquire about VET study materials for your RTO. Contact the StudyOracle team.",
  openGraph: {
    title: "Contact Us | StudyOracle",
    description:
      "Request a free sample or enquire about study materials for your RTO.",
    url: "https://studyoracle.com/contact",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact StudyOracle",
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      <Container>
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Request a sample, ask a question, or discuss your RTO&apos;s needs
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="font-heading text-lg font-semibold text-slate-900">
                Contact Information
              </h2>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Email</p>
                  <a
                    href="mailto:hello@studyoracle.com"
                    className="text-sm text-deep-blue hover:underline"
                  >
                    hello@studyoracle.com
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Response Time
                  </p>
                  <p className="text-sm text-slate-700">
                    We typically respond within one business day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
