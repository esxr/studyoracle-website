import Container from "@/components/shared/Container";

export default function TestimonialPlaceholder() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
            What RTOs Are Saying
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Testimonials from our partner RTOs are coming soon.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6"
            >
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-full rounded bg-slate-200" />
              <div className="mt-3 h-4 w-5/6 rounded bg-slate-200" />
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200" />
                <div>
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-32 rounded bg-slate-200" />
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-slate-400">
                Testimonial coming soon
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
