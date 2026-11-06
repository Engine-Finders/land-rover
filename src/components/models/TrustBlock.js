import LrIcon from "@/components/shared/LrIcon";
import { CONTAINER } from "@/lib/typeScale";
import { BAND_PAGE, CAR_ART, CAR_ART_RATIO, EyebrowPill, SANS, SECTION_Y, modelArt, prose, H2_MODEL } from "@/components/models/modelKit";
import { InsightsChart, UkDotMap } from "@/components/models/TrustBlockArt";

// Model page section 12, built to the approved reference: a framed card with "Why Velar Owners Trust
// / landroverengine.uk" (the domain in green) and the trust signals as a list (soft icon tile, the
// title in bold green, then the text, divided by hairlines); beside it the model's car standing over a
// UK dot map and an abstract insights chart. Phones: heading, list, then the car art.

// signal emoji -> brand icon (💚 has no match in the set, so it is drawn as a heart)
const SIGNAL_ICONS = { "📊": "real-inquiries", "🔧": "vetted-specialist", "🏆": "real-data" };

function HeartIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="currentColor" d="M12 21.2 10.6 20C5.4 15.4 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.9-8.6 11.5L12 21.2Z" />
    </svg>
  );
}

function SignalTile({ emoji }) {
  const name = SIGNAL_ICONS[emoji];
  const icon = "h-6 w-6 text-lr-ink sm:h-7 sm:w-7 xl:h-8 xl:w-8 dark:text-lr-green";
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lr-chip sm:h-14 sm:w-14 xl:h-[68px] xl:w-[68px]">
      {emoji === "💚" ? <HeartIcon className={icon} /> : <LrIcon name={name || "genuine-failure-data"} tone="current" className={icon} />}
    </span>
  );
}

// "Why Velar Owners Trust landroverengine.uk" -> the domain on its own line, in green
function TrustHeading({ h2 = "" }) {
  const m = h2.match(/^([\s\S]*?)\s*\b([\w-]+\.(?:co\.uk|uk|com))\b([\s\S]*)$/i);
  return (
    <h2 className={`${H2_MODEL} mt-3 text-balance text-lr-head md:mt-4`}>
      {m ? (
        <>
          {m[1]}
          <br />
          <span className="text-lr-ink dark:text-lr-green">{m[2]}</span>
          {m[3]}
        </>
      ) : (
        h2
      )}
    </h2>
  );
}

export default function TrustBlock({ data, slug = "" }) {
  if (!data) return null;
  const signals = data.signals || [];
  const art = modelArt(slug, "light");

  return (
    <section className={`${BAND_PAGE} text-lr-head ${SANS}`}>
      <div className={`${CONTAINER} ${SECTION_Y}`}>
        {/* open on the page like the home page sections - no card around the section */}
        <div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-10 xl:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)] xl:gap-14">
            <div className="min-w-0">
              <EyebrowPill>Why Trust Us</EyebrowPill>
              <TrustHeading h2={data.h2} />

              <ul className="mt-6 md:mt-8">
                {signals.map((s, i) => (
                  <li key={s.title} className="flex items-start gap-4 sm:gap-5">
                    <SignalTile emoji={s.icon} />
                    <p className={`min-w-0 flex-1 py-1 text-[15px] leading-[1.6] text-lr-body sm:py-2 md:text-[16px] xl:text-[17px] ${i < signals.length - 1 ? "mb-4 border-b border-lr-line pb-4 sm:mb-5 sm:pb-5" : ""}`}>
                      <strong className="font-semibold text-lr-ink dark:text-lr-green">{s.title}</strong>
                      {s.text && (
                        <>
                          {" — "}
                          <span dangerouslySetInnerHTML={{ __html: prose(s.text) }} />
                        </>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {art && (
              <div className="relative mx-auto aspect-[1.16] w-full max-w-[640px] lg:max-w-none" style={art} aria-hidden="true">
                <UkDotMap className="absolute left-[2%] top-0 h-[84%] text-lr-green/45 dark:text-lr-green/25" />
                <InsightsChart className="absolute right-0 top-0 w-[56%] opacity-95" />
                {/* the car stands below the chart, over only the foot of its bars, as in the reference */}
                <div className={`absolute bottom-0 left-[3%] right-0 ${CAR_ART_RATIO} ${CAR_ART}`} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
