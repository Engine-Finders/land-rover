import Image from "next/image";
import LrIcon from "@/components/shared/LrIcon";
import { BadgeStrip } from "@/components/models/costBuyerBadges";
import thumbs from "@/components/models/whoShouldBuyThumbs.json";
import { Arrow, BAND_SOFT, Eyebrow, SANS, SECTION_Y, SectionTitle, Stars, TABLE_HEAD, modelName, parseRating, prose, INTRO } from "@/components/models/modelKit";
import { BODY_SM, CONTAINER } from "@/lib/typeScale";

// Model page section 10 - who should buy, built to the approved Velar reference: the headline
// (the model name in green) with a four-up badge card beside it, then the buyer table - a photo of
// the model in a fitting landscape, the profile icon and name, its star rating and our verdict -
// and the "Real talk" bar. Phones: one card per buyer (photo on top, icon + name + stars, then the
// verdict). Tablets: one card of media rows (photo left). lg+: the reference table, dark green head.
// Photos: public/model/buyers/<slug>-<n>.webp, built by scripts/build-buyer-thumbs.py from the
// model's own car cut-outs (the generation each verdict talks about), listed in whoShouldBuyThumbs.json.

const ROW_GRID = "lg:grid-cols-[208px_minmax(0,1fr)_164px_minmax(0,1.55fr)] xl:grid-cols-[296px_minmax(0,1fr)_220px_minmax(0,1.65fr)]";

// brand icon per buyer type (first match wins)
const PROFILE_ICONS = [
  [/first 4x4/i, "terrain-response"],
  [/first|premium/i, "good-choice"],
  [/famil/i, "best-family"],
  [/commut|daily/i, "steering-wheel"],
  [/tow|work/i, "uk-wide-delivery"],
  [/budget/i, "best-used-buy-2"],
  [/design/i, "niche-style"],
  [/perform/i, "turbo"],
  [/collect|keeper|long-term/i, "best-long-term"],
];
const profileIcon = (name = "") => PROFILE_ICONS.find(([re]) => re.test(name))?.[1] || "users";

function BuyerRow({ row, thumb }) {
  const rating = parseRating(row.rating);
  const icon = profileIcon(row.buyerProfile);
  return (
    <li className={`grid grid-cols-[112px_minmax(0,1fr)] items-center gap-x-3.5 overflow-hidden rounded-xl border border-lr-line bg-lr-card p-3.5 shadow-[0_18px_44px_-36px_var(--lr-shadow)] md:grid-cols-[224px_minmax(0,1fr)] md:items-stretch md:gap-x-0 md:rounded-none md:border-0 md:p-0 md:shadow-none ${ROW_GRID}`}>
      {/* phones: a photo tile beside the name and stars; tablets and up: the row's photo cell */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-lr-panel md:row-span-2 md:m-3 md:mr-0 md:aspect-auto md:min-h-[124px] lg:row-span-1 lg:m-2.5 lg:min-h-[86px] xl:m-3 xl:min-h-[104px]">
        {thumb ? (
          <Image src={thumb} alt="" fill sizes="(min-width: 1280px) 272px, (min-width: 1024px) 190px, (min-width: 768px) 212px, 112px" className="object-cover dark:brightness-[.86]" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            <LrIcon name={icon} tone="current" className="h-10 w-10 text-lr-ink/40 dark:text-lr-green/40" />
          </span>
        )}
      </div>

      <div className="flex min-w-0 items-center gap-3 md:px-5 md:pt-4 lg:border-l lg:border-lr-line lg:px-4 lg:py-3 xl:gap-4 xl:px-6">
        <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lr-chip sm:flex md:h-[52px] md:w-[52px] xl:h-16 xl:w-16">
          <LrIcon name={icon} tone="current" className="h-6 w-6 text-lr-ink md:h-[26px] md:w-[26px] xl:h-8 xl:w-8 dark:text-lr-green" />
        </span>
        <div className="min-w-0">
          <h3 className="text-[17px] font-semibold leading-snug text-lr-head md:text-[18px] xl:text-[20px]" dangerouslySetInnerHTML={{ __html: prose(row.buyerProfile) }} />
          {rating.stars && (
            <div className="mt-1 lg:hidden">
              <Stars {...rating} />
            </div>
          )}
        </div>
      </div>

      <div className="hidden items-center justify-center border-l border-lr-line px-3 lg:flex">
        {rating.stars && <Stars {...rating} size="h-[22px] w-[22px] xl:h-7 xl:w-7" className="gap-1 xl:gap-1.5" />}
      </div>

      <p
        className={`${BODY_SM} col-span-2 pt-3 text-lr-body md:col-span-1 md:px-5 md:pb-4 md:pt-2 lg:flex lg:items-center lg:border-l lg:border-lr-line lg:px-5 lg:py-4 xl:px-7`}
        dangerouslySetInnerHTML={{ __html: prose(row.verdict) }}
      />
    </li>
  );
}

export default function WhoShouldBuy({ data, slug = "", page = null }) {
  if (!data) return null;
  const profiles = data.profiles || [];
  const model = modelName(slug) || (data.h2 || "").match(/\b(?:a|an)\s+(.+)\?\s*$/i)?.[1] || "";
  const accent = (data.h2 || "").match(/\b(?:a|an)\s+(.+\?)\s*$/i)?.[1];
  const cols = data.columns?.length === 3 ? data.columns : ["Buyer Profile", "Rating", "Our Verdict"];
  const pics = thumbs[slug] || {};

  // the badge card: what the table is built on - its profiles, the page's enquiry figure (hero),
  // the star scale and its purpose
  const enquiries = String(page?.hero?.trustStrip?.[0]?.label || "")
    .split(/\s+[-–—]\s+/)[0]
    .replace(/\s*\[[^\]]+\]/g, "")
    .trim();
  // "275+ Enquiries (2025)" -> "275+ UK enquiries analysed in 2025"
  const enq = enquiries.match(/^([\d,]+\+?).*?\((\d{4})\)/);
  const badges = [
    { icon: "users", title: "Built for Real Life", text: "Practical. Powerful. Proven." },
    { icon: "genuine-failure-data", title: "Data-Backed Ratings", text: enq ? `${enq[1]} UK enquiries analysed in ${enq[2]}.` : "Real UK enquiry data." },
    { icon: "transparent-data", title: "Honest Verdicts", text: "No hype. Just the truth about ownership." },
    { icon: "steering-wheel", title: "Buyer-Focused", text: `Find the right ${model || "car"} for your needs.` },
  ];

  return (
    <section id="who-should-buy" className={`${BAND_SOFT} text-lr-head ${SANS}`}>
      <div className={`${CONTAINER} ${SECTION_Y}`}>
        <div className="grid gap-6 xl:gap-8 min-[1400px]:grid-cols-[minmax(0,1fr)_minmax(0,min(760px,52%))] min-[1400px]:items-center min-[1400px]:gap-8">
          <div>
            <Eyebrow>Buyer Guide</Eyebrow>
            <SectionTitle h2={data.h2} accent={accent} className="mt-3 md:mt-4" />
            {data.subHeadline && <p className={INTRO} dangerouslySetInnerHTML={{ __html: prose(data.subHeadline) }} />}
          </div>
          <BadgeStrip items={badges} />
        </div>

        {profiles.length > 0 && (
          <div className="mt-6 md:mt-8 md:overflow-hidden md:rounded-xl md:border md:border-lr-line md:bg-lr-card md:shadow-[0_18px_44px_-36px_var(--lr-shadow)] lg:rounded-2xl xl:mt-10">
            <div className={`hidden ${TABLE_HEAD} text-[15px] font-semibold lg:grid ${ROW_GRID} xl:text-[16px]`}>
              <span className="col-span-2 px-5 py-3.5 text-center">{cols[0]}</span>
              <span className="px-3 py-3.5 text-center">{cols[1]}</span>
              <span className="px-5 py-3.5 text-center xl:px-7">{cols[2]}</span>
            </div>
            <ul className="space-y-3 md:space-y-0 md:divide-y md:divide-lr-line">
              {profiles.map((row, i) => (
                <BuyerRow key={`${row.buyerProfile}-${i}`} row={row} thumb={pics[row.buyerProfile]} />
              ))}
            </ul>
          </div>
        )}

        {/* the closing nudge: generic advice, pointing at the engine table */}
        <div className="mt-5 flex flex-col gap-4 rounded-xl border border-lr-line bg-lr-panel/80 p-4 sm:p-5 md:mt-6 lg:flex-row lg:items-center lg:gap-6 lg:rounded-2xl xl:px-7">
          <div className="flex items-start gap-3.5 lg:items-center">
            <LrIcon name="note" tone="current" className="h-10 w-10 shrink-0 text-lr-brand md:h-11 md:w-11 dark:text-lr-green" />
            <p className={`${BODY_SM} text-lr-body`}>
              <strong className="font-semibold text-lr-head">Real talk.</strong> The right {model || "car"} for you depends on your budget, your mileage, and your patience for maintenance.
              <span className="lg:block"> Use the data on this page to make the right call — and avoid expensive mistakes.</span>
            </p>
          </div>
          <a
            href="#engine-database"
            className="flex h-12 shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-[10px] bg-lr-brand px-5 text-[15px] font-semibold text-lr-on-brand no-underline shadow-[0_14px_30px_-18px_rgba(18,61,42,0.8)] transition-colors hover:bg-lr-brand-hover sm:self-start md:h-[52px] md:px-6 md:text-[16px] lg:ml-auto lg:self-auto"
          >
            Explore {model} Engines
            <Arrow className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
