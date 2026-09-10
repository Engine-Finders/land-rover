import { Suspense } from "react";
import QuoteForm from "@/components/shared/QuoteForm";

export const metadata = {
  title: "Get a Quote",
  description: "Request free Land Rover & Range Rover engine guidance and compare quotes from vetted JLR specialists.",
  alternates: {
    canonical: "https://landroverengine.uk/quote",
  },
};

export default function QuotePage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 md:px-8 md:py-12">
      <Suspense fallback={<p className="text-sm text-[var(--color-text-soft)]">Loading quote form…</p>}>
        <QuoteForm />
      </Suspense>
    </main>
  );
}
