import Container from "@/components/shared/Container";
import Button from "@/components/shared/Button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-deep-blue via-deep-blue/95 to-deep-blue/85 pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Subtle decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,158,11,0.1),_transparent_50%)]" aria-hidden="true" />

      <Container className="relative text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Compliance-Ready Study Materials{" "}
          <span className="text-warm-amber">for Australian RTOs</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          Independently reviewed resources mapped to training package requirements.
          Built for audit confidence.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href="/units" variant="secondary">
            Browse Unit Catalogue
          </Button>
          <Button
            href="/contact"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-deep-blue"
          >
            Request a Sample
          </Button>
        </div>
      </Container>
    </section>
  );
}
