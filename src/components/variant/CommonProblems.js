import Tagged from "@/components/variant/Tagged";
import { topicIcon } from "@/components/variant/variantText";
import { CHIP, SECTION_TITLE } from "@/components/variant/ReplacementCosts";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER, H6, ICON_MD, ICON_SM } from "@/lib/typeScale";

// Variant section 3: the engine's common problems, built to the approved reference - a label chip and
// bold sans title, then one card per problem: an urgency-coloured icon disc, the numbered title (its
// bracketed detail on a second line), icon rows for symptoms / mileage / costs / urgency, the
// recommendation, and the failure-guide link with its path. Copy from the page's `commonProblems`
// JSON; the title falls back to the engine named in the cost section's title. Follows the site theme.

const SANS = "font-[family-name:var(--font-instrument-sans)]";

// urgency colours, readable on both themes (orange has no theme token: a day / night pair)
const URGENCY = {
  "🔴": { text: "text-lr-bad", disc: "border-lr-bad/55 bg-lr-bad/10" },
  "🟠": { text: "text-[#c0560f] dark:text-[#ee9a50]", disc: "border-[#c0560f]/50 bg-[#c0560f]/10 dark:border-[#ee9a50]/55 dark:bg-[#ee9a50]/12" },
  "🟡": { text: "text-lr-gold", disc: "border-lr-gold-line/60 bg-lr-gold-line/12" },
  "🟢": { text: "text-lr-good", disc: "border-lr-good/55 bg-lr-good/10" },
};

// the reference's disc icons for the classic Tdi problems; everything else by topic
const problemIcon = (title = "") => {
  const t = title.toLowerCase();
  if (/timing belt/.test(t)) return "chain";
  if (/head gasket/.test(t)) return "engine";
  if (/injection pump|lift pump/.test(t)) return "petrol";
  return topicIcon(title);
};

const dash = (t = "") => String(t).replace(/ - /g, " — ");
// "Timing Belt Failure (Rubber Belt Deterioration)" -> ["Timing Belt Failure", "(Rubber Belt Deterioration)"]
function splitTitle(title = "") {
  const i = title.indexOf(" (");
  return i === -1 ? [title, ""] : [title.slice(0, i), title.slice(i + 1)];
}
// "Read the full timing belt guide" from the title when the data has no label
const guideLabel = (title = "") => `Read the full ${splitTitle(title)[0].split(/\s+/).slice(0, 2).join(" ").toLowerCase()} guide`;

function Row({ icon, label, block = false, children }) {
  return (
    <li className="flex gap-3">
      <LrIcon name={icon} tone="current" className={`mt-[3px] ${ICON_SM} text-lr-body`} />
      <p className="min-w-0 text-[14.5px] leading-[1.55] text-lr-body lg:text-[13.5px] lg:leading-[1.5] xl:text-[16px]">
        <span className={`font-semibold text-lr-head ${block ? "block" : ""}`}>{label}:</span>
        {block ? "" : " "}
        {children}
      </p>
    </li>
  );
}

function ProblemCard({ p, n }) {
  const u = URGENCY[p.urgency?.icon] || URGENCY["🟠"];
  const link = p.failureLink?.href && p.failureLink.href !== "#" ? p.failureLink.href : "";
  const [main, detail] = splitTitle(dash(p.title));
  const hasDetails = p.symptoms || p.typicalMileage || p.repairCost || p.replacementCost || p.urgency?.label || p.recommendation;
  return (
    <article className="flex flex-col rounded-lg border border-lr-line bg-lr-card p-4 shadow-[0_10px_24px_-22px_var(--lr-shadow)] md:p-5 lg:p-4 xl:p-5">
      <header className="flex items-center gap-3.5 lg:gap-3 xl:gap-3.5">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] md:h-[52px] md:w-[52px] lg:h-12 lg:w-12 xl:h-[52px] xl:w-[52px] ${u.text} ${u.disc}`}>
          <LrIcon name={problemIcon(p.title)} tone="current" className={ICON_MD} />
        </span>
        <h3 className={`${H6} text-lr-head`}>
          {n}. <span dangerouslySetInnerHTML={{ __html: main }} />
          {detail && <span className="block" dangerouslySetInnerHTML={{ __html: detail }} />}
        </h3>
      </header>

      {hasDetails && (
        <ul className="mt-4 space-y-2.5 lg:space-y-2">
          {p.symptoms && <Row icon="symptoms" label="Symptoms"><Tagged value={p.symptoms} /></Row>}
          {p.typicalMileage && <Row icon="meter" label="Typical Mileage"><Tagged value={p.typicalMileage} /></Row>}
          {p.repairCost && <Row icon="oem-references" label="Repair Cost"><Tagged value={p.repairCost} /></Row>}
          {p.replacementCost && <Row icon="specific-knowledge" label="Replacement Cost"><Tagged value={p.replacementCost} /></Row>}
          {p.urgency?.label && (
            <Row icon="genuine-failure-data" label="Urgency">
              <span className={`font-semibold ${u.text}`}>{p.urgency.label}</span>
              {p.urgency.text && <> — <span dangerouslySetInnerHTML={{ __html: p.urgency.text }} /></>}
            </Row>
          )}
          {p.recommendation && (
            <Row icon="symptoms" label="Our recommendation" block>
              <span dangerouslySetInnerHTML={{ __html: dash(p.recommendation) }} />
            </Row>
          )}
        </ul>
      )}

      {link && (
        <a href={link} className="group mt-auto block pt-4 text-[14.5px] font-medium text-lr-ink no-underline dark:text-lr-green xl:text-[15px]">
          <span className="underline-offset-4 group-hover:underline">{p.failureLink.label || guideLabel(p.title)}</span> <span aria-hidden="true">→</span>
          <span className="block truncate text-[13.5px] font-normal text-lr-ink/80 dark:text-lr-green/80 xl:text-[15px]">{link}</span>
        </a>
      )}
    </article>
  );
}

export default function CommonProblems({ data, engineTitle = "" }) {
  const problems = data?.problems || [];
  if (!problems.length) return null;
  // "Land Rover Defender D240 Engine Replacement Costs" -> "Common Problems With Land Rover Defender D240 Engines"
  const fallback = engineTitle ? `Common Problems With ${engineTitle.replace(/\s*Engine Replacement Costs\s*$/i, "")} Engines` : "Common Problems";

  return (
    <section className={`relative bg-lr-page text-lr-head ${SANS}`}>
      <div className={`relative ${CONTAINER} py-8 md:py-12 lg:py-11`}>
        <span className={CHIP}>Common Problems</span>
        <h2 className={`${SECTION_TITLE} mt-3 text-lr-head`}>{data.h2 || fallback}</h2>

        <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-2 md:gap-4 lg:grid-cols-3 [&>*:last-child:nth-child(odd)]:md:col-span-2 [&>*:last-child:nth-child(odd)]:lg:col-span-1">
          {problems.map((p, i) => (
            <ProblemCard key={p.id || p.title} p={p} n={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
