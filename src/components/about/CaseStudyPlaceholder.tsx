import Container from "@/components/shared/Container";

export default function CaseStudyPlaceholder() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
            Case Studies
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Detailed case studies showing how RTOs have used our materials to strengthen their compliance posture will be published here.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-sm text-slate-400">
            Case studies in development. Check back soon.
          </p>
        </div>
      </Container>
    </section>
  );
}
