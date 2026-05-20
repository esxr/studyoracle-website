import Container from "@/components/shared/Container";

const steps = [
  {
    number: "01",
    title: "Training Package Analysis",
    description:
      "Every unit is mapped to its performance criteria, knowledge evidence, and assessment requirements from the official training package.",
  },
  {
    number: "02",
    title: "Content Development",
    description:
      "Study materials are written by subject matter experts with deep knowledge of the vocational sector and training package requirements.",
  },
  {
    number: "03",
    title: "Independent Review",
    description:
      "Materials are reviewed by VET compliance specialists who verify coverage, accuracy, and alignment with training package requirements.",
  },
  {
    number: "04",
    title: "Evidence Pack Assembly",
    description:
      "Each unit ships with a validation-ready evidence pack documenting coverage mapping, review outcomes, and compliance alignment.",
  },
];

export default function ReviewProcess() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
            Our Review Process
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            A rigorous four-step process designed to deliver materials that support your compliance needs.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="font-heading text-4xl font-bold text-deep-blue/10">
                {step.number}
              </span>
              <h3 className="mt-2 font-heading text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
