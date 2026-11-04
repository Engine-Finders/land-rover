import VIcon from "@/components/variant/VariantIcons";
import Tagged from "@/components/variant/Tagged";
import { topicIcon } from "@/components/variant/variantText";
import { BODY_SM, CONTAINER, H2, H6, LABEL, SMALL } from "@/lib/typeScale";

// Variant section: the engine's common problems as cards (symptoms, mileage, costs, urgency,
// recommendation, failure guide link) from the page's `commonProblems` JSON. Follows the site theme
// (day / night).

// urgency: red / orange / amber / green, readable on both themes (orange has no theme token, so it
// pairs a light-theme and a night-theme value)
const URGENCY = {
  "🔴": { text: "text-lr-bad", disc: "border-lr-bad/50 bg-lr-bad/10" },
  "🟠": { text: "text-[#c0560f] dark:text-[#ee9a50]", disc: "border-[#c0560f]/45 bg-[#c0560f]/10 dark:border-[#ee9a50]/50 dark:bg-[#ee9a50]/12" },
  "🟡": { text: "text-lr-warn", disc: "border-lr-warn/50 bg-lr-warn/10" },
  "🟢": { text: "text-lr-good", disc: "border-lr-good/50 bg-lr-good/10" },
};

function Row({ icon, label, children }) {
  return (
    <li className="flex gap-2.5">
      <VIcon name={icon} className="mt-1 h-4 w-4 shrink-0 text-lr-muted" />
      <p className={`${BODY_SM} min-w-0 text-lr-body`}>
        <span className="font-semibold text-lr-head">{label}:</span> {children}
      </p>
    </li>
  );
}

function ProblemCard({ p, n }) {
  const u = URGENCY[p.urgency?.icon] || URGENCY["🟠"];
  const link = p.failureLink?.href;
  return (
    <article className="flex flex-col rounded-xl border border-lr-line bg-lr-card p-4 shadow-[0_20px_44px_-34px_var(--lr-shadow)] md:p-5">
      <header className="flex items-center gap-3.5">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${u.text} ${u.disc}`}>
          <VIcon name={topicIcon(p.title)} className="h-6 w-6" />
        </span>
        <h3 className={`${H6} text-lr-head`}>
          {n}. <span dangerouslySetInnerHTML={{ __html: p.title }} />
        </h3>
      </header>

      <ul className="mt-4 space-y-2 border-t border-lr-line pt-4">
        {p.symptoms && <Row icon="clipboard" label="Symptoms"><Tagged value={p.symptoms} /></Row>}
        {p.typicalMileage && <Row icon="gauge" label="Typical Mileage"><Tagged value={p.typicalMileage} /></Row>}
        {p.repairCost && <Row icon="receipt" label="Repair Cost"><Tagged value={p.repairCost} /></Row>}
        {p.replacementCost && <Row icon="engine" label="Replacement Cost"><Tagged value={p.replacementCost} /></Row>}
        {p.urgency && (
          <Row icon="alert" label="Urgency">
            <span className={`font-semibold ${u.text}`}>{p.urgency.label}</span>
            {p.urgency.text && <> — <span dangerouslySetInnerHTML={{ __html: p.urgency.text }} /></>}
          </Row>
        )}
      </ul>

      {p.recommendation && (
        <div className="mt-3 flex gap-2.5 rounded-lg bg-lr-panel p-3">
          <VIcon name="thumb" className="mt-1 h-4 w-4 shrink-0 text-lr-green" />
          <p className={`${BODY_SM} text-lr-body`}>
            <span className="block font-semibold text-lr-head">Our recommendation:</span>
            <span dangerouslySetInnerHTML={{ __html: p.recommendation }} />
          </p>
        </div>
      )}

      {link && (
        <a href={link} className={`${BODY_SM} group mt-auto pt-4 font-medium text-lr-green`}>
          <span className="underline-offset-4 group-hover:underline">{p.failureLink.label || "Read the full failure guide"}</span> <span aria-hidden="true">→</span>
          <span className={`${SMALL} block truncate font-normal text-lr-muted`}>{link}</span>
        </a>
      )}
    </article>
  );
}

export default function CommonProblems({ data }) {
  const problems = data?.problems || [];
  if (!problems.length) return null;

  return (
    <section className="relative overflow-hidden bg-lr-band text-lr-head">
      <div className={`relative ${CONTAINER} border-t border-transparent py-10 md:py-14`}>
        <span className={`${LABEL} inline-block rounded bg-lr-chip px-2.5 py-1 text-lr-green`}>
          Common Problems
        </span>
        <h2 className={`${H2} mt-3 text-lr-head`}>
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
