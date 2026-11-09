import Image from "next/image";
import Link from "next/link";
import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER } from "@/lib/typeScale";
import { Arrow, H2_MODEL, SANS, prose } from "@/components/models/modelKit";
import { keyEngines, stripHtml } from "@/components/models/engineSections";
import { localHref, localHtml } from "@/components/models/generationsFaqLinks";
import SectionQuoteCta from "@/components/shared/SectionQuoteCta";
import { generationCtaCopy } from "@/lib/ctaCopy";
import { genCode, genName } from "./genKit";

// Generation page section 6 - common problems, built to the approved Defender L316 reference: the
// eyebrow, "<generation> — Common Problems" headline, a one-line intro and a split rule; one card per
// problem - its number, the engine over the fault, an engine shot in the corner, affected models,
// typical failure mileage and root cause with icons, the tiered cost table (preventative repair:
// dealer / specialist / the work), the catastrophic tier as a coloured box, our recommendation and a
// "Compare … prices" button; then a four-point trust strip.
// Tiers come from the JSON's tieredCosts; where those are empty, from the costs the recommendation
// itself states ("a £200 harness replacement is … cheaper than the £800+ ECU replacement that follows").
// Phones: swipe through the cards (the next one peeks in); tablets 2-up; laptops one row.

const html = (raw) => localHtml(prose(raw || ""));
const capital = (t = "") => String(t).trim().replace(/^[a-z]/, (c) => c.toUpperCase());
const MONEY = "£[\\d,]+(?:\\s?[–-]\\s?£[\\d,]+)?\\+?";

// ------------------------------------------------------------------ title

// tokens that belong to the engine part of a title ("2.4 / 2.2 Td4", "Rover V8", "204DT 2.0 Ingenium Diesel")
const ENGINE_WORD =
  /^(?:\/|&|\(.*\d.*\)|.*\d.*|Td\d|TDi?|Tdi|TDV\d|SDV\d|SCV\d|V\d|Si\d|SI\d|Ingenium|Puma|BMW|Rover|Ford|Duratorq|Jaguar|AJ[-‑\w]*|GTDI|EcoBoost|[KL][-‑]Series|KV6|VM|Turbodiesel|MPi|EFi|Diesel|Petrol|Supercharged|PHEV|MHEV|DW12)$/i;
const isEngineToken = (t) => t.split("/").some((part) => ENGINE_WORD.test(part) || part === "");

// "Td5 Injector Wiring Harness Oil Contamination" -> { engine: "Td5", fault: "Injector Wiring …" }
function splitTitle(raw = "") {
  const text = stripHtml(raw);
  const tokens = text.split(/\s+/);
  let i = 0;
  while (i < tokens.length && isEngineToken(tokens[i])) i += 1;
  const engine = tokens.slice(0, i).join(" ");
  const fault = tokens.slice(i).join(" ");
  if (engine && fault && /\d|Tdi|V\d|Ingenium|Rover|BMW|VM|Series/i.test(engine)) return { engine, fault };
  // non-engine faults led by the generation ("Defender L316 Chassis Corrosion")
  const gen = text.match(/^(.*?\b(?:L\d{3}|P38A?|D\d|Classic)\b)\s+(.+)$/);
  return gen ? { engine: gen[1], fault: gen[2], general: true } : { engine: "", fault: text, general: true };
}

// ------------------------------------------------------------------ tiers

// the JSON's tiers when filled in, else the two costs the recommendation names
function tiers(problem) {
  const filled = (problem.tieredCosts || []).filter((t) => t.dealer || t.specialist || t.work || t.note);
  if (filled.length) {
    const pre = filled.find((t) => /prevent|repair/i.test(t.tier)) || filled[0];
    const cat = filled.find((t) => t !== pre);
    return {
      source: "data",
      pre: pre && { label: pre.tier, dealer: pre.dealer, specialist: pre.specialist, work: pre.work, note: pre.note },
      cat: cat && { label: cat.tier, cost: cat.specialist || cat.dealer, body: [cat.work, cat.note].filter(Boolean).map(capital).join(". ") },
    };
  }
  const text = stripHtml(problem.recommendation || "");
  const pair = (cost, work, catCost, catBody) => ({
    source: "text",
    pre: { label: "Preventative (Repair)", cost, work: capital(work.replace(/^(?:preventative)\s+/i, "")) },
    cat: catCost ? { label: "If ignored", cost: catCost, body: capital(catBody) } : null,
  });
  // "a £200 harness replacement is … cheaper than the £800+ ECU replacement that follows"
  let m = text.match(new RegExp(`(${MONEY})\\s+([^.;£]*?)\\s+is\\s+[^£.]*?(?:than|against)\\s+the\\s+(${MONEY})\\s+([^.;£]*?)\\s+that\\s+follows`, "i"));
  if (m) return pair(m[1], m[2], m[3], m[4]);
  // "a £200–£400 job that can save you from a £2,500+ head gasket bill"
  m = text.match(new RegExp(`(${MONEY})\\s+([^.;£]*?)\\s+that\\s+can\\s+save\\s+you\\s+from\\s+an?\\s+(${MONEY})\\s+([^.;£]*?)(?:\\s+bill)?[.;]`, "i"));
  if (m) return pair(m[1], m[2], m[3], m[4]);
  // "A £300–£600 refurbishment is manageable"
  m = text.match(new RegExp(`\\ban?\\s+(${MONEY})\\s+([a-z][^.;£]*?)\\s+is\\s+manageable`, "i"));
  if (m) return pair(m[1], m[2]);
  return null;
}

// the costliest tier's figure decides its tone: amber under £5,000, red above
function catTone(cost = "") {
  const top = Math.max(...(String(cost).match(/[\d,]+/g) || ["0"]).map((n) => Number(n.replace(/,/g, ""))));
  return top >= 5000
    ? { box: "border-[#e8b3b3] bg-[#fdf3f3] dark:border-[#7a3a3a] dark:bg-[#3a1f22]/50", text: "text-[#c62828] dark:text-[#ff8f8f]" }
    : { box: "border-[#efc99a] bg-[#fdf6ec] dark:border-[#7a5a2e] dark:bg-[#3a2c18]/50", text: "text-[#c96a12] dark:text-[#ffb36b]" };
}

// ------------------------------------------------------------------ pieces

const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

function ClockIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g {...STROKE}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5V12l3 2" />
      </g>
    </svg>
  );
}

function Fact({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      {icon === "clock" ? (
        <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-lr-ink dark:text-lr-green" />
      ) : (
        <LrIcon name={icon} tone="current" className="mt-0.5 h-5 w-5 shrink-0 text-lr-ink dark:text-lr-green" />
      )}
      <div className="min-w-0">
        <p className="text-[14px] font-semibold leading-snug text-lr-ink xl:text-[15px] dark:text-lr-green">{label}</p>
        <p className="mt-0.5 text-[14px] leading-[1.5] text-lr-body [&_a]:text-inherit [&_a]:underline" dangerouslySetInnerHTML={{ __html: html(value).replace(/\.$/, "") }} />
      </div>
    </div>
  );
}

function TierTable({ pre }) {
  const works = String(pre.work || "")
    .split(/;\s*/)
    .map((w) => capital(w))
    .filter(Boolean);
  const cols = pre.cost ? [["Typical cost", pre.cost]] : [["Dealer", pre.dealer], ["Specialist", pre.specialist]].filter(([, v]) => v);
  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-lr-line text-[13px] leading-snug">
      <div className="flex items-center gap-2 border-b border-lr-line bg-lr-panel/70 px-3 py-1.5 font-semibold text-lr-head">
        <LrIcon name="commercial" tone="current" className="h-4 w-4 shrink-0 text-lr-ink dark:text-lr-green" />
        {pre.label}
      </div>
      <div className={`grid divide-x divide-lr-line border-b border-lr-line ${cols.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
        {cols.map(([k, v]) => (
          <div key={k} className="px-3 py-1.5 text-center">
            <span className="block text-[12px] text-lr-muted">{k}</span>
            <span className="block font-semibold text-lr-head">{v}</span>
          </div>
        ))}
      </div>
      {works.map((w, i) => (
        <p key={i} className="border-b border-lr-line px-3 py-1.5 text-center text-lr-body last:border-b-0" dangerouslySetInnerHTML={{ __html: html(w) }} />
      ))}
      {pre.note && <p className="bg-lr-panel/40 px-3 py-1.5 text-center text-[12px] text-lr-muted" dangerouslySetInnerHTML={{ __html: html(capital(pre.note)) }} />}
    </div>
  );
}

function CatBox({ cat }) {
  const tone = catTone(cat.cost);
  return (
    <div className={`mt-3 rounded-lg border px-3.5 py-3 ${tone.box}`}>
      <p className="flex items-center gap-2.5 text-[14px] font-semibold leading-snug">
        <svg viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 ${tone.text}`} aria-hidden="true">
          <path d="M10.4 3.9 2.4 17.7a1.8 1.8 0 0 0 1.6 2.8h16a1.8 1.8 0 0 0 1.6-2.8L13.6 3.9a1.8 1.8 0 0 0-3.2 0Z" fill="currentColor" />
          <path d="M12 9v5M12 17.2h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className={tone.text}>{cat.label}</span>
        {cat.cost && <span className="ml-auto whitespace-nowrap font-semibold text-lr-head">{cat.cost}</span>}
      </p>
      {cat.body && <p className="mt-1.5 text-[13.5px] leading-[1.5] text-lr-body" dangerouslySetInnerHTML={{ __html: html(cat.body) }} />}
    </div>
  );
}

function ShieldIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2.5 20 5.6v5.9c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V5.6Z" fill="currentColor" />
      <path d="m8.4 12.2 2.5 2.5 4.9-5.2" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProblemCard({ problem, index, shot }) {
  const { engine, fault } = splitTitle(problem.title);
  const t = tiers(problem);
  const label = String(problem.cta?.label || "").replace(/\s*(?:→|->)\s*$/, "").trim() || `Compare ${engine || "engine"} prices`;
  const href = localHref(problem.cta?.href) || "/quote";
  return (
    <li className="relative flex min-w-0 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-lr-line bg-lr-card p-4 shadow-[0_18px_44px_-34px_var(--lr-shadow)] basis-[88%] sm:basis-[62%] md:basis-auto md:p-5">
      {shot && (
        <span className="pointer-events-none absolute right-0 top-0 h-[140px] w-[160px] [mask-image:radial-gradient(115%_105%_at_100%_0%,#000_40%,transparent_74%)] xl:h-[150px] xl:w-[172px]" aria-hidden="true">
          <Image src={shot} alt="" fill sizes="160px" className="object-cover object-left-bottom opacity-95 dark:opacity-80" />
        </span>
      )}
      <div className="relative flex items-start gap-3 pr-[58px] xl:pr-[64px]">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-lr-brand text-[20px] font-bold leading-none text-lr-on-brand xl:h-12 xl:w-12 xl:text-[22px]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="min-w-0 leading-snug">
          {engine && <span className="block text-[20px] font-semibold leading-tight text-lr-head [text-shadow:0_0_12px_var(--lr-card)] xl:text-[22px]">{engine}</span>}
          <span className={`block text-lr-head [text-shadow:0_0_12px_var(--lr-card)] ${engine ? "mt-0.5 text-[15px] xl:text-[16px]" : "text-[18px] font-semibold xl:text-[20px]"}`}>{fault}</span>
        </h3>
      </div>

      <div className="relative mt-4 space-y-3">
        <Fact icon="vehicle" label="Affected models:" value={problem.affectedModels} />
        <Fact icon="clock" label="Typical failure mileage:" value={problem.typicalFailureMileage} />
        <Fact icon="specific-knowledge" label="Root cause:" value={problem.rootCause} />
      </div>

      {t?.pre && (
        <div className="mt-4">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.04em] text-lr-head">Tiered cost table</p>
          <TierTable pre={t.pre} />
        </div>
      )}
      {t?.cat && <CatBox cat={t.cat} />}

      {problem.recommendation && (
        <div className="mt-4 flex gap-2.5">
          <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#2346a0] dark:text-[#8eaaf5]" />
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.04em] text-[#2346a0] dark:text-[#8eaaf5]">Our recommendation</p>
            <p className="mt-1 text-[14px] leading-[1.55] text-lr-body" dangerouslySetInnerHTML={{ __html: html(problem.recommendation) }} />
          </div>
        </div>
      )}

      <div className="mt-auto pt-5">
        <Link
          href={href}
          className="flex min-h-11 items-center justify-center gap-2 rounded-md bg-lr-brand px-4 py-2.5 text-center text-[14px] font-semibold leading-snug text-lr-on-brand no-underline transition-colors hover:bg-lr-brand-hover"
        >
          <span>{label}</span>
          <Arrow className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </li>
  );
}

// ------------------------------------------------------------------ section

const STRIP_ICONS = [
  <LrIcon key="a" name="genuine-failure-data" tone="current" className="h-8 w-8 xl:h-9 xl:w-9" />,
  <LrIcon key="b" name="real-inquiries" tone="current" className="h-8 w-8 xl:h-9 xl:w-9" />,
  <LrIcon key="c" name="commercial" tone="current" className="h-8 w-8 xl:h-9 xl:w-9" />,
  <LrIcon key="d" name="good-choice" tone="current" className="h-8 w-8 xl:h-9 xl:w-9" />,
];

export default function CommonProblems({ data, page = null }) {
  const problems = data?.problems || [];
  if (!problems.length) return null;

  const name = genName(page);
  const code = genCode(`${page?.hero?.h1 || ""} ${page?.hero?.tagPill || ""}`);
  const owners = code && code !== "Classic" ? code : name.replace(/^Land Rover\s+/, "");
  const cta = generationCtaCopy({
    brandLabel: /^Range Rover/i.test(name) ? "Range Rover" : "Land Rover",
    modelShort: name.replace(/^(Land Rover|Range Rover)\s+/i, "").replace(new RegExp(`\\s*${code}$`, "i"), "").trim(),
    generation: code || owners,
  });
  const enquiries = String(page?.hero?.trustStrip?.[0]?.label || "").match(/^(\d[\d,]*\+?)/)?.[1];

  // one engine shot per engine, none for chassis / suspension / body faults
  const engines = problems.map((p) => {
    const t = splitTitle(p.title);
    return t.general ? "" : t.engine;
  });
  const unique = [...new Set(engines.filter(Boolean))];
  const shots = Object.fromEntries(keyEngines(unique.join(", ")).map((e, i) => [unique[i], e.shot]));

  const strip = [
    { title: "UK Specialist Data", text: enquiries ? `Problems drawn from ${enquiries} real UK ${owners} enquiries in 2025.` : `Problems drawn from real UK ${owners} enquiries and specialist workshop data.` },
    { title: "Honest Costing", text: "Dealer and specialist pricing for real-world decisions." },
    { title: "Expert Recommendations", text: "Every fault comes with our honest recommendation from UK specialist experience." },
    { title: "Transparent Advice", text: "We tell you when to repair, when to walk, and when it’s worth the investment." },
  ];
  const n = problems.length;
  const cols = n >= 4 && n % 4 === 0 ? "xl:grid-cols-4" : n % 3 === 0 || n === 5 ? "xl:grid-cols-3" : "xl:grid-cols-4";

  return (
    <section className={`bg-lr-band py-6 text-lr-head md:py-7 xl:py-8 ${SANS}`}>
      <div className={CONTAINER}>
        <p className="text-[13px] font-semibold uppercase leading-none tracking-[0.06em] text-lr-ink md:text-[14px] xl:text-[16px] dark:text-lr-green">Common Problems</p>
        <h2 className={`${H2_MODEL} mt-3.5 text-balance text-lr-head md:mt-4`}>{name ? `${name} — Common Problems` : "Common Problems"}</h2>
        <p className="mt-3 max-w-[50em] text-[15px] leading-[1.6] text-lr-body md:mt-4 md:text-[16px] xl:text-[17px]">
          Real-world issues {owners} owners face most — with symptoms, causes, costs and our honest recommendations based on UK specialist experience.
        </p>
        <span className="mt-4 flex h-[3px] w-20 overflow-hidden rounded-full md:mt-5" aria-hidden="true">
          <span className="w-[60%] bg-lr-ink dark:bg-lr-green" />
          <span className="flex-1 bg-lr-gold-line" />
        </span>

        <ul
          className={`-mx-5 mt-6 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:mt-8 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 xl:gap-5 ${cols} [&::-webkit-scrollbar]:hidden`}
          aria-label={`${owners} common problems`}
        >
          {problems.map((p, i) => (
            <ProblemCard key={p.id || i} problem={p} index={i} shot={shots[engines[i]] || ""} />
          ))}
        </ul>
        {n > 1 && <p className="mt-2.5 text-[13px] text-lr-muted md:hidden">Swipe for all {n} problems →</p>}

        <ul className="mt-5 grid overflow-hidden rounded-xl border border-lr-line bg-lr-card shadow-[0_18px_44px_-36px_var(--lr-shadow)] sm:grid-cols-2 md:mt-6 xl:grid-cols-4">
          {strip.map((s, i) => (
            <li
              key={s.title}
              className={`relative flex items-center gap-4 px-5 py-4 xl:gap-5 xl:px-7 xl:py-5 ${i > 0 ? "border-t border-lr-line sm:border-t-0" : ""} ${i >= 2 ? "sm:border-t sm:border-lr-line xl:border-t-0" : ""} ${
                i % 2 === 1 ? "sm:border-l sm:border-lr-line xl:border-l-0" : ""
              } ${i > 0 ? "xl:before:absolute xl:before:inset-y-5 xl:before:left-0 xl:before:w-px xl:before:bg-lr-line" : ""}`}
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[1.5px] border-lr-ink/40 text-lr-ink xl:h-[66px] xl:w-[66px] dark:border-lr-gold-line/55 dark:text-lr-gold">
                {STRIP_ICONS[i]}
              </span>
              <div className="min-w-0">
                <p className="text-[16px] font-semibold leading-snug text-lr-head xl:text-[17px]">{s.title}</p>
                <p className="mt-1 text-[14px] leading-[1.5] text-lr-body">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <SectionQuoteCta label={cta.problemsButton} supportText={cta.problemsSupport} />
      </div>
    </section>
  );
}
