import Container from "./Container";
import Button from "./Button";

interface CTASectionProps {
  headline: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}

export default function CTASection({
  headline,
  primaryAction,
  secondaryAction,
}: CTASectionProps) {
  return (
    <section className="bg-deep-blue py-16 sm:py-20">
      <Container className="text-center">
        <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
          {headline}
        </h2>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href={primaryAction.href} variant="secondary">
            {primaryAction.label}
          </Button>
          {secondaryAction && (
            <Button
              href={secondaryAction.href}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-deep-blue"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
