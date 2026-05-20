import Container from "@/components/shared/Container";
import TrustBadge from "@/components/shared/TrustBadge";

export default function TrustSignals() {
  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TrustBadge icon="shield">
            Designed to support RTO compliance under the 2025 Standards
          </TrustBadge>
          <TrustBadge icon="check">
            Independently reviewed by VET compliance specialists
          </TrustBadge>
          <TrustBadge icon="file">
            Includes a validation-ready evidence pack
          </TrustBadge>
          <TrustBadge icon="map">
            Mapped to training package requirements
          </TrustBadge>
        </div>
      </Container>
    </section>
  );
}
