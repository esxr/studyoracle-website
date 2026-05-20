import type { Metadata } from "next";
import Container from "@/components/shared/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "StudyOracle's privacy policy. How we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-16">
      <Container className="prose prose-slate mx-auto max-w-3xl">
        <h1 className="font-heading">Privacy Policy</h1>
        <p className="lead">
          Last updated: May 2026
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          StudyOracle collects personal information only through our contact form.
          The information collected includes:
        </p>
        <ul>
          <li>Full name</li>
          <li>Organisation name</li>
          <li>Job title / role</li>
          <li>Email address</li>
          <li>Phone number (optional)</li>
          <li>Message content</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information you provide solely to respond to your enquiry,
          provide you with information about our study materials, and to improve our
          services. We do not sell, rent, or share your personal information with
          third parties for marketing purposes.
        </p>

        <h2>3. Analytics</h2>
        <p>
          This website uses Vercel Analytics, a privacy-friendly analytics service
          that does not use cookies and does not collect personally identifiable
          information. Analytics data is used in aggregate to understand website
          usage patterns and improve our services.
        </p>

        <h2>4. Data Retention</h2>
        <p>
          Contact form submissions are retained for the period necessary to respond
          to your enquiry and maintain a record of our communications. You may
          request deletion of your data at any time by contacting us.
        </p>

        <h2>5. Data Security</h2>
        <p>
          We take reasonable steps to protect the personal information we hold from
          misuse, interference, loss, and unauthorised access, modification, or
          disclosure.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          Under the Australian Privacy Act 1988, you have the right to access the
          personal information we hold about you and to request corrections. To make
          a request, please contact us at{" "}
          <a href="mailto:hello@studyoracle.com">hello@studyoracle.com</a>.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. Any changes will be
          posted on this page with an updated revision date.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or how we handle your
          personal information, please contact us at{" "}
          <a href="mailto:hello@studyoracle.com">hello@studyoracle.com</a>.
        </p>
      </Container>
    </div>
  );
}
