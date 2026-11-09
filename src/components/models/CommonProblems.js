import Image from "next/image";
import { CONTAINER, LABEL } from "@/lib/typeScale";
import { Arrow, BAND_SOFT, CARD, Eyebrow, SANS, SECTION_Y, SERIF, SectionTitle, prose, INTRO } from "@/components/models/modelKit";
import SectionQuoteCta from "@/components/shared/SectionQuoteCta";
import { modelCtaCopy } from "@/lib/ctaCopy";

// Model page section 6, built to the approved "Common Velar Engine Problems" reference: the eyebrow,
// the serif headline ("Common" dark, the rest green) with its short gold rule, then one card per
// problem - the part photographed on a dark studio backdrop with its "01" number, the serif title,
// the urgency dot and label, the description and "Learn more" - and the urgency key along the foot.
// Cards: one column on phones (photo on top), photo-left from sm, two columns from md (photo on top
// again at md, photo-left from lg), three columns from xl as in the reference.
// Photos: public/model/problems/*.webp (scripts/build-model-problem-art.py) - trimmed alpha
// cut-outs, so the dark backdrop is painted here and fits every card shape in both themes.

const ART = (key) => `/model/problems/${key}.webp`;

// problem wording -> candidate photos, most fitting first; each card takes the first photo not
// already used on the page, so a page's six cards never repeat a picture
const ART_RULES = [
  [/crank|bottom-end/i, ["crankshaft"]],
  [/supercharger/i, (t) => (/AJ126/i.test(t) ? ["engine-sdv", "engine-diesel"] : ["engine-diesel", "engine-sdv"])],
  [/KV6|cambelt/i, ["engine-v6", "engine-silver"]],
  [/oil pump/i, ["engine-v6", "engine-silver"]],
  [/timing|chain|tensioner/i, (t) => (/Si4|GTDi/i.test(t) ? ["timing-chain", "engine-silver", "engine-black"] : ["timing-chain", "engine-black"])],
  [/battery|electrical/i, ["battery"]],
  [/air suspension|compressor/i, ["air-compressor", "valve-block"]],
  [/haldex|diff/i, ["differential", "propshaft"]],
  [/PTU|rear drive|transfer/i, ["transfer-box", "propshaft"]],
  [/oil dilution/i, ["engine-ingenium", "engine-black"]],
  [/EGR/i, ["engine-black", "engine-diesel"]],
  [/\bTD5\b|Tdi/i, ["engine-tdi", "engine-200tdi"]],
  [/K-series/i, ["engine-silver", "engine-v6"]],
  [/Rover V8|liner/i, ["engine-diesel", "engine-sdv"]],
  [/turbo|intercooler/i, ["engine-ingenium", "engine-diesel"]],
  [/injector|DPF/i, ["engine-diesel", "engine-black", "engine-silver"]],
];
const ART_FALLBACK = ["engine-black", "engine-diesel", "engine-silver", "engine-v6"];

function pickArt(issue, used) {
  const rule = ART_RULES.find(([re]) => re.test(issue));
  const list = rule ? (typeof rule[1] === "function" ? rule[1](issue) : rule[1]) : ART_FALLBACK;
  const key = list.find((k) => !used.has(k)) || list[0];
  used.add(key);
  return ART(key);
}

// "Learn more" goes to the engine's own page when the data has no link of its own (href "#")
const ENGINE_PAGES = [
  [/306DT/i, "306dt"],
  [/276DT/i, "276dt"],
  [/368DT/i, "368dt"],
  [/448DT|SDV8/i, "448dt"],
  [/AJ133/i, "aj133"],
  [/AJ20D6/i, "aj20d6"],
  [/AJ20P6/i, "aj20p6"],
  [/\bTD5\b/i, "td5"],
  [/K-series/i, "k-series-18-23"],
  [/M47|\bTd4\b/i, "m47"],
  [/Si4|GTDi|PT204/i, "ford-si4-pt204"],
  [/224DT/i, "psa-dw12-204dtd"],
  [/204DTD|Ingenium Diesel/i, "ingenium-20-diesel"],
  [/Ingenium Oil Dilution/i, "aj20d6"],
  [/204PT/i, "ingenium-20-petrol"],
  [/[23]00Tdi/i, "200-300tdi"],
];

const plain = (html = "") => String(html).replace(/<[^>]+>/g, "");

function learnMoreHref(problem, issue) {
  const href = problem.link?.href;
  if (href && href !== "#") return href;
  const hit = ENGINE_PAGES.find(([re]) => re.test(issue));
  return hit ? `/engine/${hit[1]}` : "";
}

// the urgency scale, shared by the cards and the key (the dots read the same in both themes)
const URGENCY = {
  catastrophic: "bg-[#d93f3f]",
  immediate: "bg-[#e46f24]",
  monitor: "bg-[#e9b42c]",
  low: "bg-lr-good",
};
const urgencyDot = (type = "") => URGENCY[String(type).toLowerCase()] || URGENCY.monitor;
const sentence = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

function Dot({ type, className = "h-3 w-3" }) {
  return <span aria-hidden="true" className={`inline-block shrink-0 rounded-full ${urgencyDot(type)} ${className}`} />;
}

function ProblemCard({ problem, index, art }) {
  const issue = plain(problem.issue);
  const href = learnMoreHref(problem, issue);
  const label = (problem.link?.label || "Learn more").replace(/\s*(?:→|->)\s*$/, "");
  const number = String(problem.id ?? index + 1).padStart(2, "0");

  return (
    <li className={`${CARD} flex min-w-0 flex-col overflow-hidden sm:flex-row md:flex-col lg:flex-row`}>
      {/* the part on a dark studio backdrop with its number */}
      <div className="relative hidden shrink-0 overflow-hidden bg-[#0b0d0c] sm:block sm:min-h-[220px] sm:w-[40%] md:aspect-[2/1] md:min-h-0 md:w-auto lg:aspect-auto lg:min-h-[260px] lg:w-[40%] xl:w-[37%]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_42%,rgba(255,255,255,0.13),rgba(255,255,255,0.03)_55%,transparent_75%),linear-gradient(to_bottom,#151917,#070908)]"
        />
        <Image
          src={art}
          alt=""
          fill
          sizes="(min-width: 1280px) 180px, (min-width: 1024px) 200px, (min-width: 768px) 360px, (min-width: 640px) 240px, 100vw"
          className="object-contain p-2 drop-shadow-[0_10px_18px_rgba(0,0,0,0.55)] sm:scale-[1.35] md:scale-[1.1] lg:scale-[1.5]"
        />
        <span className="absolute left-3 top-3 rounded-md border border-white/15 bg-black/55 px-2 py-0.5 text-[14px] font-semibold leading-6 text-white backdrop-blur-sm md:text-[15px]">
          {number}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5 xl:px-5 xl:py-6 min-[1440px]:px-6">
        <div className="flex items-start gap-3.5 sm:block">
        <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-lg bg-[#0b0d0c] sm:hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_45%,rgba(255,255,255,0.14),rgba(255,255,255,0.03)_55%,transparent_78%),linear-gradient(to_bottom,#151917,#070908)]" />
          <Image src={art} alt="" fill sizes="88px" className="scale-[1.3] object-contain p-1.5 drop-shadow-[0_6px_10px_rgba(0,0,0,0.55)]" />
          <span className="absolute left-1.5 top-1.5 rounded border border-white/15 bg-black/60 px-1.5 text-[12px] font-semibold leading-5 text-white">{number}</span>
        </div>
        <div className="min-w-0 flex-1">
        <h3
          className={`${SERIF} text-[19px] leading-[1.25] text-lr-head sm:text-[20px] md:text-[21px] xl:text-[22px] [&_a]:[font-weight:inherit] [&_a]:text-inherit [&_a]:no-underline hover:[&_a]:underline`}
          dangerouslySetInnerHTML={{ __html: prose(problem.issue) }}
        />
        {problem.severity?.label && (
          <p className="mt-2 flex items-center gap-2.5 text-[15px] font-medium text-lr-head sm:mt-3">
            <Dot type={problem.severity.type} />
            {problem.severity.label}
          </p>
        )}
        </div>
        </div>
        {problem.description && (
          <p className={`mt-3.5 text-[14.5px] leading-[1.6] text-lr-body sm:mt-3 md:text-[15px] [&_a]:font-medium [&_a]:text-lr-green [&_a]:no-underline hover:[&_a]:underline`} dangerouslySetInnerHTML={{ __html: prose(problem.description) }} />
        )}
        {href && (
          <a
            href={href}
            aria-label={`${label} about ${issue}`}
            className="mt-auto inline-flex items-center gap-1.5 self-end pt-3 text-[15px] sm:pt-4 font-medium text-lr-ink no-underline hover:underline dark:text-lr-green"
          >
            {label}
            <Arrow className="h-4 w-4" />
          </a>
        )}
      </div>
    </li>
  );
}

function UrgencyKey({ items }) {
  return (
    <div className={`${CARD} mt-5 grid grid-cols-2 gap-x-4 gap-y-5 p-5 md:mt-6 md:grid-cols-4 md:gap-y-0 md:p-6 xl:grid-cols-[auto_repeat(4,minmax(0,1fr))] xl:items-start xl:px-8 xl:py-7`}>
      <p className={`${LABEL} col-span-2 text-lr-head md:col-span-4 md:mb-5 xl:col-span-1 xl:mb-0 xl:pr-10 xl:pt-0.5`}>Urgency key</p>
      {items.map((item, i) => (
        <div key={item.label} className={`flex min-w-0 gap-3 ${i > 0 ? "md:border-l md:border-lr-line md:pl-5 xl:pl-7" : "xl:border-l xl:border-lr-line xl:pl-7"}`}>
          <Dot type={item.label} className="mt-1 h-3.5 w-3.5" />
          <p className="min-w-0 text-[14px] leading-snug text-lr-body md:text-[15px]">
            <strong className="block text-[15px] font-semibold text-lr-head md:text-[16px]">{item.label}</strong>
            <span className="mt-1 block">{sentence(item.text)}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default function CommonProblems({ data, slug = "" }) {
  if (!data) return null;

  const cta = modelCtaCopy(slug);
  const h2 = String(data.h2 || "");
  const accent = /^Common\s+/i.test(h2) ? h2.replace(/^Common\s+/i, "") : "";
  const used = new Set();
  const problems = (data.problems || []).map((p) => ({ problem: p, art: pickArt(plain(p.issue), used) }));

  return (
    <section id="common-problems" className={`${BAND_SOFT} text-lr-head ${SANS}`}>
      <div className={`${CONTAINER} ${SECTION_Y}`}>
        <Eyebrow>Engine Problems</Eyebrow>
        <SectionTitle h2={h2} accent={accent || undefined} className="mt-3 md:mt-4" />
        <span aria-hidden="true" className="mt-4 block h-[3px] w-12 rounded-full bg-lr-gold-line md:mt-5" />
        {data.subHeadline && <p className={`${INTRO} max-w-[29em]!`} dangerouslySetInnerHTML={{ __html: prose(data.subHeadline) }} />}

        {problems.length > 0 && (
          <ol className="mt-7 grid gap-4 md:mt-9 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
            {problems.map(({ problem, art }, i) => (
              <ProblemCard key={problem.id ?? i} problem={problem} index={i} art={art} />
            ))}
          </ol>
        )}

        {data.urgencyKey?.length > 0 && <UrgencyKey items={data.urgencyKey} />}

        <SectionQuoteCta label={cta.problemsButton} supportText={cta.problemsSupport} />
      </div>
    </section>
  );
}
