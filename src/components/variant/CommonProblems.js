import VIcon from "@/components/variant/VariantIcons";
import Tagged from "@/components/variant/Tagged";
import { topicIcon } from "@/components/variant/variantText";

// Variant section: the engine's common problems as cards (symptoms, mileage, costs, urgency,
// recommendation, failure guide link) from the page's `commonProblems` JSON. Fixed dark design.

const GREEN = "#7f9f4f";
const SANS = { fontFamily: "var(--font-instrument-sans), Arial, sans-serif" };

const URGENCY = {
  "🔴": { text: "#f0645a", ring: "rgba(240,100,90,0.55)", bg: "rgba(160,40,32,0.28)" },
  "🟠": { text: "#e8a04a", ring: "rgba(232,160,74,0.55)", bg: "rgba(150,90,20,0.28)" },
  "🟡": { text: "#e6c94d", ring: "rgba(230,201,77,0.5)", bg: "rgba(140,115,20,0.28)" },
  "🟢": { text: "#9cc46a", ring: "rgba(156,196,106,0.5)", bg: "rgba(70,100,40,0.3)" },
};

function Row({ icon, label, children }) {
  return (
    <li className="flex gap-2.5">
      <VIcon name={icon} className="mt-[3px] h-4 w-4 shrink-0 text-white/55" />
      <p className="min-w-0 text-[13.5px] leading-[1.55] text-white/80 md:text-[14px]">
        <span className="font-semibold text-white">{label}:</span> {children}
      </p>
    </li>
  );
}

function ProblemCard({ p, n }) {
  const u = URGENCY[p.urgency?.icon] || URGENCY["🟠"];
  const link = p.failureLink?.href;
  return (
    <article className="flex flex-col rounded-xl border border-white/12 bg-white/[0.03] p-4 md:p-5">
      <header className="flex items-center gap-3.5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border" style={{ color: u.text, borderColor: u.ring, background: u.bg }}>
          <VIcon name={topicIcon(p.title)} className="h-6 w-6" />
        </span>
        <h3 className="text-[16px] font-semibold leading-snug text-white md:text-[17px]">
          {n}. <span dangerouslySetInnerHTML={{ __html: p.title }} />
        </h3>
      </header>

      <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
        {p.symptoms && <Row icon="clipboard" label="Symptoms"><Tagged value={p.symptoms} /></Row>}
        {p.typicalMileage && <Row icon="gauge" label="Typical Mileage"><Tagged value={p.typicalMileage} /></Row>}
        {p.repairCost && <Row icon="receipt" label="Repair Cost"><Tagged value={p.repairCost} /></Row>}
        {p.replacementCost && <Row icon="engine" label="Replacement Cost"><Tagged value={p.replacementCost} /></Row>}
        {p.urgency && (
          <Row icon="alert" label="Urgency">
            <span className="font-semibold" style={{ color: u.text }}>{p.urgency.label}</span>
            {p.urgency.text && <> — <span dangerouslySetInnerHTML={{ __html: p.urgency.text }} /></>}
          </Row>
        )}
      </ul>

      {p.recommendation && (
        <div className="mt-3 flex gap-2.5 rounded-lg bg-black/30 p-3">
          <VIcon name="thumb" className="mt-[3px] h-4 w-4 shrink-0" style={{ color: GREEN }} />
          <p className="text-[13.5px] leading-[1.55] text-white/80 md:text-[14px]">
            <span className="block font-semibold text-white">Our recommendation:</span>
            <span dangerouslySetInnerHTML={{ __html: p.recommendation }} />
          </p>
        </div>
      )}

      {link && (
        <a href={link} className="group mt-auto pt-4 text-[14px] leading-snug" style={{ color: GREEN }}>
          <span className="underline-offset-4 group-hover:underline">{p.failureLink.label || "Read the full failure guide"}</span> <span aria-hidden="true">→</span>
          <span className="block truncate text-[12.5px] text-white/45">{link}</span>
        </a>
      )}
    </article>
  );
}

export default function CommonProblems({ data }) {
  const problems = data?.problems || [];
  if (!problems.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#0b0d0a] text-white">
      <div className="relative mx-auto max-w-8xl border-t border-white/10 px-4 py-10 sm:px-6 md:px-8 md:py-14">
        <span className="inline-block rounded bg-[#1d2a18] px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#a9c47e] md:text-[11px]">
          Common Problems
        </span>
        <h2 className="mt-3 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[30px] lg:text-[36px]" style={SANS}>
          {data.h2 || "Common Problems"}
        </h2>

        <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
          {problems.map((p, i) => (
            <ProblemCard key={p.id || p.title} p={p} n={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
