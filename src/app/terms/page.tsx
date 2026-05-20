import type { Metadata } from "next";
import Container from "@/components/shared/Container";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "StudyOracle website terms of use.",
};

export default function TermsPage() {
  return (
    <div className="pt-24 pb-16">
      <Container className="prose prose-slate mx-auto max-w-3xl">
        <h1 className="font-heading">Terms of Use</h1>
        <p className="lead">
          Last updated: May 2026
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using the StudyOracle website (studyoracle.com), you
          accept and agree to be bound by these terms and conditions. If you do not
          agree with these terms, please do not use this website.
        </p>

        <h2>2. Use of Website</h2>
        <p>
          This website is provided for informational purposes and to facilitate
          enquiries about StudyOracle study materials. You agree to use this website
          only for lawful purposes and in a manner that does not infringe the rights
          of, or restrict or inhibit the use and enjoyment of, this website by any
          third party.
        </p>

        <h2>3. Intellectual Property</h2>
        <p>
          All content on this website, including text, graphics, logos, and software,
          is the property of StudyOracle or its licensors and is protected by
          Australian and international intellectual property laws. You may not
          reproduce, distribute, or create derivative works from any content on this
          website without prior written consent.
        </p>

        <h2>4. Study Materials Disclaimer</h2>
        <p>
          StudyOracle study materials are designed to support RTOs in meeting their
          training and assessment obligations. However, final contextualisation,
          validation and compliance remain the responsibility of each RTO. StudyOracle
          does not guarantee that use of our materials will ensure compliance with any
          specific regulatory requirement.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, StudyOracle excludes all liability
          for any loss or damage arising from the use of this website or reliance on
          information provided on this website. This includes, but is not limited to,
          indirect or consequential loss, loss of profit, loss of revenue, or loss of
          data.
        </p>

        <h2>6. Third-Party Links</h2>
        <p>
          This website may contain links to third-party websites. StudyOracle is not
          responsible for the content, accuracy, or practices of any third-party
          website and does not endorse any third-party products or services.
        </p>

        <h2>7. Modifications</h2>
        <p>
          StudyOracle reserves the right to modify these terms at any time. Changes
          will be effective immediately upon posting to this website. Your continued
          use of the website following any changes constitutes acceptance of those
          changes.
        </p>

        <h2>8. Governing Law</h2>
        <p>
          These terms are governed by and construed in accordance with the laws of
          the Commonwealth of Australia. Any disputes arising from these terms or your
          use of this website shall be subject to the exclusive jurisdiction of the
          courts of Australia.
        </p>

        <h2>9. Contact</h2>
        <p>
          If you have any questions about these terms, please contact us at{" "}
          <a href="mailto:hello@studyoracle.com">hello@studyoracle.com</a>.
        </p>
      </Container>
    </div>
  );
}
