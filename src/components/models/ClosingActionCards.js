import LrIcon from "@/components/shared/LrIcon";
import OpenQuoteButton from "@/components/shared/OpenQuoteButton";
import { BODY_SM, CONTAINER, H5 } from "@/lib/typeScale";
import { Arrow, BACKDROP, BAND_SOFT, CAR_ART, CAR_ART_RATIO, EyebrowPill, SANS, SECTION_Y, modelArt, prose, H2_MODEL, INTRO } from "@/components/models/modelKit";
import { generationLinks, resolveHref } from "@/components/models/ClosingActionLinks";
import { UkPinMap } from "@/components/models/TrustBlockArt";
import { isQuoteHref } from "@/lib/quoteModal";

// Model page section 14, built to the approved reference: "Ready to Make / a Decision?" with a short
// rule, the model's car on the loch-side backdrop (feathered into the band), then the three action
// cards - explore (the model's line-up), diagnose (a green-tinted engine with the inputs the card
// names) and compare specialists (a UK map with gold pins) - each with an icon tile, an accented
// title, a rule, the text and its link. Phones stack the cards under the car.
// The card JSON's planned URLs are mapped to live routes (ClosingActionLinks.js); a card that names
// several generations gets a link per generation page instead of one dead "…" link.

const CARD_SHELL = "relative flex flex-col overflow-hidden rounded-xl border border-lr-line shadow-[0_18px_44px_-36px_var(--lr-shadow)] lg:rounded-2xl";
const TINT = {
  explore: "bg-[color-mix(in_srgb,var(--lr-chip)_55%,var(--lr-card))]",
  diagnose: "bg-[color-mix(in_srgb,var(--lr-chip)_55%,var(--lr-card))]",
  compare: "bg-[color-mix(in_srgb,var(--lr-gold)_8%,var(--lr-card))]",
};
const KIND_BY_EMOJI = { "🔍": "explore", "🩺": "diagnose", "🤝": "compare" };
const LINK_LABEL = { explore: "Explore Now", diagnose: "Start Diagnosis", compare: "Compare Specialists" };

// desktop art: the backdrop feathered into the band towards the heading and the cards
const ART_FADE =
  "[mask-image:linear-gradient(to_right,transparent_3%,#000_36%),linear-gradient(to_bottom,#000_62%,transparent)] [mask-composite:intersect]";
const ART_FADE_M = "[mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_78%,transparent)]";

function Stethoscope({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 2v2M5 2v2M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
      <path d="M8 15a6 6 0 0 0 12 0v-3" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}

function Handshake({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8" />
    </svg>
  );
}

function CardIcon({ kind }) {
  const cls = "h-8 w-8 xl:h-10 xl:w-10";
  if (kind === "diagnose") return <Stethoscope className={`${cls} text-lr-ink dark:text-lr-green`} />;
  if (kind === "compare") return <Handshake className={`${cls} text-lr-gold`} />;
  return <LrIcon name="scope-decision" tone="current" className={`${cls} text-lr-ink dark:text-lr-green`} />;
}

// the diagnostic tool's inputs, listed beside the stethoscope as in the reference
function diagnoseInputs() {
  return ["Symptoms", "Engine Code", "Mileage", "History"];
}

// title with its accent: a generation code / "Generations" in green, "My <Model>" in green,
// "UK Specialists" in gold
function accentTitle(title = "", kind) {
  const patterns = {
    explore: /\b(L\d{3}|D\d|P38A|Generations)\b/,
    diagnose: /\bMy\s[\s\S]+$/,
    compare: /\bUK Specialists\b|\bSpecialists\b/,
  };
  const m = title.match(patterns[kind]);
  if (!m) return title;
  const i = m.index;
  const color = kind === "compare" ? "text-lr-gold" : "text-lr-ink dark:text-lr-green";
  return (
    <>
      {title.slice(0, i)}
      <span className={color}>{m[0]}</span>
      {title.slice(i + m[0].length)}
    </>
  );
}

function CardArt({ kind, text, slug }) {
  if (kind === "explore") {
    const cars = {
      "--cars-day": `url(/model/hero/${slug}-cars-day.webp)`,
      "--cars-night": `url(/model/hero/${slug}-cars-night.webp)`,
      "--cars-day-m": `url(/model/hero/${slug}-cars-day-m.webp)`,
      "--cars-night-m": `url(/model/hero/${slug}-cars-night-m.webp)`,
    };
    return (
      <span
        className="absolute bottom-0 left-[14%] aspect-[2040/670] w-[86%] bg-contain bg-bottom bg-no-repeat bg-[image:var(--cars-day-m)] sm:bg-[image:var(--cars-day)] dark:bg-[image:var(--cars-night-m)] sm:dark:bg-[image:var(--cars-night)]"
        style={cars}
        aria-hidden="true"
      />
    );
  }
  if (kind === "diagnose") {
    const inputs = diagnoseInputs(text);
    return (
      <>
        <span
          className="absolute -right-[6%] -top-[6%] h-[118%] w-[62%] bg-[url(/home/engine-core.webp)] bg-contain bg-right bg-no-repeat opacity-60 [filter:grayscale(1)_sepia(0.4)_hue-rotate(62deg)_saturate(1.05)_brightness(1.12)] dark:opacity-35"
          aria-hidden="true"
        />
        {inputs.length > 0 && (
          <ul className="absolute left-[92px] top-5 space-y-1.5 sm:left-[104px] lg:max-xl:hidden xl:left-[124px] xl:top-6" aria-hidden="true">
            {inputs.map((t) => (
              <li key={t} className="flex items-center gap-2 text-[13px] font-medium text-lr-body xl:text-[14px]">
                <LrIcon name="good-choice" tone="current" className="h-4 w-4 text-lr-ink dark:text-lr-green" />
                {t}
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }
  return <UkPinMap className="absolute right-[6%] top-3 h-[112%] max-w-[58%]" />;
}

function ActionCard({ card, index, slug, gens }) {
  const kind = KIND_BY_EMOJI[card.icon] || ["explore", "diagnose", "compare"][index] || "explore";
  // strip raw path lists the copy carries ("… → /freelander/fl1/ • /freelander/l359/")
  const text = (card.text || "").replace(/\s*→\s*\/\S+(?:\s*•\s*\/\S+)*/g, "").trim();
  const href = resolveHref(card.href, kind === "diagnose" ? "diagnose" : "verdict");
  const chips = kind === "explore" && !href ? gens : [];
  const linkColor = kind === "compare" ? "text-lr-gold" : "text-lr-ink dark:text-lr-green";

  return (
    <li className={`${CARD_SHELL} ${TINT[kind]}`}>
      <div className="relative h-[150px] sm:h-[170px] xl:h-[190px]">
        <CardArt kind={kind} text={text} slug={slug} />
        <span className="absolute left-5 top-5 flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-lr-card shadow-[0_10px_24px_-14px_var(--lr-shadow)] sm:h-[68px] sm:w-[68px] xl:left-6 xl:top-6 xl:h-20 xl:w-20">
          <CardIcon kind={kind} />
        </span>
      </div>

      <div className="relative flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6 xl:px-7 xl:pb-7">
        <h3 className={`${H5} font-semibold text-lr-head xl:text-[26px]`}>{accentTitle(card.title || "", kind)}</h3>
        <span className={`mt-3 block h-[3px] w-10 rounded-full ${kind === "compare" ? "bg-lr-gold" : "bg-lr-green"}`} aria-hidden="true" />
        {text && <p className={`${BODY_SM} mt-3 text-lr-body`} dangerouslySetInnerHTML={{ __html: prose(text) }} />}

        <div className="mt-auto pt-5">
          {href && isQuoteHref(href) ? (
            <OpenQuoteButton className={`group inline-flex items-center gap-3 text-[16px] font-semibold no-underline xl:text-[17px] ${linkColor}`}>
              {LINK_LABEL[kind]}
              <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </OpenQuoteButton>
          ) : href ? (
            <a href={href} className={`group inline-flex items-center gap-3 text-[16px] font-semibold no-underline xl:text-[17px] ${linkColor}`}>
              {LINK_LABEL[kind]}
              <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </a>
          ) : chips.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className={`mr-1 text-[15px] font-semibold ${linkColor}`}>Explore</span>
              {chips.map((g) => (
                <a
                  key={g.href}
                  href={g.href}
                  className="rounded-full border border-lr-line-strong bg-lr-card/70 px-3 py-1 text-[13.5px] font-semibold text-lr-ink no-underline transition-colors hover:border-lr-green hover:bg-lr-card dark:text-lr-green"
                >
                  {g.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

// "Ready to Make a Decision?" -> "Ready to Make" / "a Decision?" (accent)
function splitDecision(h2 = "") {
  const m = h2.match(/^([\s\S]*\S)\s+(a\s+\S+)$/i);
  return m ? { lead: m[1], accent: m[2] } : { lead: h2, accent: "" };
}

export default function ClosingActionCards({ data, slug = "", page }) {
  if (!data) return null;
  const { lead, accent } = splitDecision(data.h2 || "");
  const cards = data.cards || [];
  const gens = generationLinks(page);
  const art = modelArt(slug);

  return (
    <section className={`relative overflow-hidden ${BAND_SOFT} text-lr-head ${SANS}`}>
      <div className={`${CONTAINER} ${SECTION_Y}`}>
        <div className="relative lg:min-h-[300px] xl:min-h-[350px]">
          {/* desktop: the car on the loch-side backdrop, feathered into the band */}
          {art && (
            <div className="pointer-events-none absolute -top-14 bottom-0 left-[38%] right-[calc(50%-50vw)] hidden lg:block xl:-top-16" style={art} aria-hidden="true">
              <div className={`absolute inset-0 ${BACKDROP} ${ART_FADE}`} />
              <div className={`absolute bottom-[2%] right-[5%] w-[70%] max-w-[640px] ${CAR_ART_RATIO} ${CAR_ART}`} />
            </div>
          )}

          <div className="relative lg:max-w-[40%]">
            <EyebrowPill>Next Steps</EyebrowPill>
            <h2 className={`${H2_MODEL} mt-3 text-balance text-lr-head md:mt-4`}>
              {lead}
              {accent && (
                <>
                  <br />
                  <span className="text-lr-ink dark:text-lr-green">{accent}</span>
                </>
              )}
            </h2>
            <span className="mt-5 block h-[3px] w-12 rounded-full bg-lr-green xl:mt-6" aria-hidden="true" />
            {data.subHeadline && (
              <p className={`${INTRO} max-w-[30em]!`}>
                {String(data.subHeadline)
                  .split(/(?<=\.)\s+(?=Data\.)/)
                  .map((line, i) => (
                    <span key={i} className={i ? "sm:block" : ""} dangerouslySetInnerHTML={{ __html: (i ? " " : "") + prose(line) }} />
                  ))}
              </p>
            )}
          </div>

          {/* phones / tablets: the car full-bleed under the heading */}
          {art && (
            <div className="relative -mx-5 sm:-mx-6 mt-5 aspect-[16/10] sm:aspect-[2/1] md:-mx-10 lg:hidden" style={art} aria-hidden="true">
              <div className={`absolute inset-0 ${BACKDROP} ${ART_FADE_M}`} />
              <div className={`absolute bottom-[8%] left-1/2 w-[84%] max-w-[560px] -translate-x-1/2 ${CAR_ART_RATIO} ${CAR_ART}`} />
            </div>
          )}
        </div>

        {cards.length > 0 && (
          <ul className="relative mt-2 grid gap-4 sm:gap-5 lg:mt-6 lg:grid-cols-3 lg:gap-6">
            {cards.map((card, i) => (
              <ActionCard key={card.title || i} card={card} index={i} slug={slug} gens={gens} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
