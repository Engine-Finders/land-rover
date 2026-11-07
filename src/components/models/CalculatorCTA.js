import LrIcon from "@/components/shared/LrIcon";
import { BODY, BODY_SM, CONTAINER } from "@/lib/typeScale";
import {
  Arrow,
  BAND_PAGE,
  CAR_ART,
  CAR_ART_RATIO,
  CARD,
  EyebrowPill,
  SANS,
  SECTION_Y,
  SERIF,
  modelArt,
  modelName,
  prose,
  splitHeading,
  H2_MODEL,
  INTRO,
} from "@/components/models/modelKit";
import { resolveHref } from "@/components/models/ClosingActionLinks";

// Model page section 11, built to the approved reference: "Can I Repair My Velar Engine — / or Should
// I Replace It?" with the question line and "The smarter way to decide" callout beside the model's car,
// the two PATH cards (know your engine -> the calculator with the model pre-selected; not sure ->
// identify the engine first) and the dark "Stop guessing" banner. Phones stack it in that order.
// Links: the JSON's planned /calculator URLs are mapped to the live tools (ClosingActionLinks.js).

const SERIF_TITLE = `${SERIF} font-normal tracking-[-0.01em]`;

// "Path 1 - Know your engine? Launch with Velar pre-selected" -> { n, title, body }
function parsePath(label = "") {
  const m = label.match(/^Path\s*(\d+)\s*[-–—:]\s*([\s\S]*)$/i);
  const rest = (m ? m[2] : label).trim();
  const q = rest.indexOf("?");
  const title = q === -1 ? rest : rest.slice(0, q + 1);
  let body = q === -1 ? "" : rest.slice(q + 1).trim();
  if (body && !/[.!?]$/.test(body)) body += ".";
  return { n: m ? m[1] : "", title, body };
}

// the intro's questions, and its closing "Get a personalised verdict…" sentence for the callout
function splitIntro(intro = "") {
  const m = intro.match(/^([\s\S]*?)(?:(?<=[.?!])\s+|\s+-\s+)(get\s[\s\S]+)$/i);
  if (!m) return { question: intro.trim(), callout: "" };
  let question = m[1].trim();
  if (question && !/[.?!]$/.test(question)) question += ".";
  return { question, callout: m[2].charAt(0).toUpperCase() + m[2].slice(1) };
}

// accent the opening words of a path title, as in the reference ("Know your engine?", "Not sure which…")
function accentTitle(title = "") {
  const m = title.match(/^(Not sure|\S+)(\s[\s\S]*)?$/i);
  if (!m) return title;
  return (
    <>
      <span className="text-lr-ink dark:text-lr-green">{m[1]}</span>
      {m[2]}
    </>
  );
}

function TargetIcon({ className = "h-7 w-7" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="13" r="8" />
      <circle cx="11" cy="13" r="4.2" />
      <circle cx="11" cy="13" r="0.9" fill="currentColor" />
      <path d="m11 13 9.5-9.5M17 3.5h3.5V7" />
    </svg>
  );
}

function Feature({ icon, title, sub }) {
  return (
    <li className="flex items-center gap-3 sm:justify-center sm:px-3 sm:first:justify-start sm:first:pl-0 sm:last:pr-0">
      <LrIcon name={icon} tone="current" className="h-6 w-6 text-lr-ink xl:h-7 xl:w-7 dark:text-lr-green" />
      <span className="min-w-0 leading-snug">
        <span className="block text-[14px] font-semibold text-lr-head xl:text-[15px]">{title}</span>
        <span className="block text-[13px] text-lr-muted xl:text-[14px]">{sub}</span>
      </span>
    </li>
  );
}

function PathCard({ path, href, index, model }) {
  const parsed = parsePath(path.label);
  const primary = index === 0;
  const { n, title } = parsed;
  const body = primary && model ? `Launch the ${model} diagnostic calculator with your engine pre-selected.` : parsed.body;
  const button = primary
    ? { icon: "calculator", label: `Launch ${model} Diagnostic Calculator`, sub: "Engine pre-selected" }
    : { icon: "engine", label: "Identify My Engine First", sub: "Then launch the diagnostic calculator" };
  const Tag = href ? "a" : "span";

  return (
    <article className={`${CARD} relative flex flex-col p-5 sm:p-7 xl:p-8`}>
      <span className="inline-flex w-fit items-center rounded-md bg-lr-brand px-2.5 py-1 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-lr-on-brand xl:text-[13.5px]">
        Path {n || index + 1}
      </span>
      <span className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full bg-lr-chip sm:right-6 sm:top-6 sm:h-24 sm:w-24 xl:right-8 xl:top-7 xl:h-[124px] xl:w-[124px]" aria-hidden="true">
        <LrIcon name={primary ? "engine" : "not-sure"} tone="current" className="h-7 w-7 text-lr-ink sm:h-11 sm:w-11 xl:h-14 xl:w-14 dark:text-lr-green" />
      </span>

      <h3 className={`${SERIF_TITLE} mt-4 text-balance pr-16 text-[26px] leading-[1.15] text-lr-head sm:mt-5 sm:pr-28 sm:text-[30px] xl:pr-36 xl:text-[36px]`}>{accentTitle(title)}</h3>
      {body && <p className={`${BODY} mt-2.5 max-w-[26em] text-lr-body sm:pr-28 xl:pr-36`} dangerouslySetInnerHTML={{ __html: prose(body) }} />}

      <div className="mt-6 flex flex-1 flex-col justify-end xl:mt-8">
        <Tag
          {...(href ? { href } : {})}
          className={`group flex items-center gap-3.5 rounded-xl px-4 py-3.5 no-underline transition-colors sm:gap-4 sm:px-5 xl:px-6 xl:py-5 ${
            primary
              ? "bg-lr-brand text-lr-on-brand shadow-[0_16px_30px_-20px_rgba(18,61,42,0.9)] hover:bg-lr-brand-hover"
              : "border-[1.5px] border-lr-ink/70 bg-lr-card text-lr-head hover:bg-lr-chip dark:border-lr-green/60"
          }`}
        >
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg xl:h-[52px] xl:w-[52px] ${primary ? "border border-white/25 bg-white/5" : "bg-lr-chip"}`}>
            <LrIcon name={button.icon} tone={primary ? "skin" : "current"} className={`h-6 w-6 xl:h-7 xl:w-7 ${primary ? "" : "text-lr-ink dark:text-lr-green"}`} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-semibold leading-snug sm:text-[17px] xl:text-[19px]">{button.label}</span>
            <span className={`mt-0.5 block text-[13.5px] leading-snug xl:text-[15px] ${primary ? "text-white/75" : "text-lr-muted"}`}>{button.sub}</span>
          </span>
          <Arrow className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
        </Tag>

        {primary ? (
          <ul className="mt-5 grid gap-3.5 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-lr-line xl:mt-6">
            <Feature icon="good-choice" title={`${model} pre-selected`} sub="All engines covered" />
            <Feature icon="real-inquiries" title="Real UK cost data" sub="Used, recon & rebuilt" />
            <Feature icon="genuine-failure-data" title="Instant verdict" sub="Repair vs replace" />
          </ul>
        ) : (
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-lr-chip/70 px-4 py-3.5 xl:mt-6 xl:items-center xl:px-5">
            <LrIcon name="note" tone="current" className="mt-0.5 h-6 w-6 text-lr-ink xl:mt-0 dark:text-lr-green" />
            <p className={`${BODY_SM} text-lr-body`}>
              <strong className="block font-semibold text-lr-head">Identification is the first step inside the tool.</strong> We&rsquo;ll pinpoint your exact engine code before running the diagnostics.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

export default function CalculatorCTA({ data, slug = "" }) {
  if (!data) return null;

  const { lead, accent } = splitHeading(data.h2);
  const or = accent.match(/^(or\s+)([\s\S]+)$/i);
  const { question, callout } = splitIntro(data.intro || "");
  const paths = (data.paths || []).slice(0, 2);
  const hrefs = paths.map((p) => resolveHref(p.href, "verdict"));
  const fromPath = (paths[0]?.label || "").match(/with\s+(.+?)\s+pre-selected/i);
  const model = fromPath ? fromPath[1] : modelName(slug);
  const art = modelArt(slug, "silver");

  return (
    <section className={`relative overflow-hidden ${BAND_PAGE} text-lr-head ${SANS}`}>
      <div className={`${CONTAINER} ${SECTION_Y}`}>
        <div className="grid items-start gap-6 md:gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] xl:gap-14">
          <div className="min-w-0">
            <EyebrowPill>Repair or Replace</EyebrowPill>
            {/* 38-50px from xl so "Can I Repair My … Engine — / or Should I Replace It?" holds two lines beside the car */}
            <h2 className={`${H2_MODEL} mt-3 text-balance text-lr-head md:mt-4`}>
              {accent ? (
                <>
                  {lead}
                  {" "}—<br />
                  {or ? (
                    <>
                      {or[1]}
                      <span className="text-lr-ink dark:text-lr-green">{or[2]}</span>
                    </>
                  ) : (
                    <span className="text-lr-ink dark:text-lr-green">{accent}</span>
                  )}
                </>
              ) : (
                lead
              )}
            </h2>
            {question && (
              <p className={INTRO}>
                <span dangerouslySetInnerHTML={{ __html: prose(question) }} />
                {data.context && <span className="mt-1 block" dangerouslySetInnerHTML={{ __html: prose(data.context) }} />}
              </p>
            )}
            {callout && (
              <div className="mt-5 flex max-w-[600px] items-center gap-3.5 rounded-xl bg-lr-chip/60 p-3 pr-4 sm:gap-4 sm:p-3.5 sm:pr-5 xl:mt-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lr-card xl:h-14 xl:w-14">
                  <LrIcon name="calculator" tone="current" className="h-6 w-6 text-lr-ink xl:h-7 xl:w-7 dark:text-lr-green" />
                </span>
                <p className={`${BODY_SM} text-lr-body`}>
                  <strong className="font-semibold text-lr-head">The smarter way to decide:</strong>{" "}
                  <span dangerouslySetInnerHTML={{ __html: prose(callout) }} />
                </p>
              </div>
            )}
          </div>

          {art && (
            <div className="relative mx-auto w-full max-w-[560px] xl:max-w-none xl:self-center" style={art} aria-hidden="true">
              {/* soft studio fade behind the car */}
              <span className="absolute -right-[12%] -top-[18%] aspect-square w-[72%] rounded-full bg-[radial-gradient(circle,var(--lr-chip)_0%,transparent_70%)] opacity-90" />
              <div className={`relative ${CAR_ART_RATIO} ${CAR_ART}`} />
            </div>
          )}
        </div>

        {paths.length > 0 && (
          <div className="mt-7 grid gap-5 md:mt-9 xl:grid-cols-2 xl:gap-6">
            {paths.map((p, i) => (
              <PathCard key={p.label} path={p} href={hrefs[i]} index={i} model={model} />
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-col gap-5 rounded-2xl bg-lr-brand p-5 text-lr-on-brand shadow-[0_24px_50px_-34px_rgba(10,30,20,0.9)] sm:p-7 md:mt-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 xl:px-10 xl:py-8 dark:border dark:border-lr-line-strong dark:bg-lr-page">
          <div className="flex items-start gap-4 sm:items-center sm:gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/5 xl:h-[72px] xl:w-[72px]">
              <TargetIcon className="h-7 w-7 text-[var(--lr-icon-on-brand)] xl:h-9 xl:w-9" />
            </span>
            <div className="min-w-0">
              <h3 className={`${SERIF_TITLE} text-[22px] leading-tight sm:text-[26px] xl:text-[30px]`}>Stop guessing. Get the right answer.</h3>
              <p className="mt-1.5 max-w-[34em] text-[14.5px] leading-[1.55] text-white/75 md:text-[15px] xl:text-[16px]">
                Our calculator compares real repair and replacement costs against your car&rsquo;s value — so you know the financially smarter move.
              </p>
            </div>
          </div>
          {hrefs[0] && (
            <a
              href={hrefs[0]}
              className="group flex h-14 shrink-0 items-center justify-center gap-3 rounded-xl bg-lr-green px-6 text-[16px] font-semibold text-white no-underline shadow-[0_14px_30px_-18px_rgba(0,0,0,0.8)] transition-[filter] hover:brightness-110 lg:h-16 lg:min-w-[320px] xl:h-[72px] xl:min-w-[400px] xl:text-[19px] dark:bg-lr-brand"
            >
              Start Your Verdict Now
              <Arrow className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
