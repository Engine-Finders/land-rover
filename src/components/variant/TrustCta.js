import Link from "next/link";
import PhotoScene, { EnginePlate } from "@/components/variant/PhotoScene";

// Variant section: why owners trust us - three trust cards, a dark feature banner (the variant's
// car on the dusk highland photo, the final CTA and, on desktop, the engine as a studio product
// plate) and a five-point trust bar. Copy from the page's `trustCta` JSON. Light section.

const INK = "#1f3d24";
const GOLD = "#c9a24a";
const SERIF = { fontFamily: "var(--font-serif-display), Georgia, 'Times New Roman', serif" };

/* ---------- solid icons (white glyph on green disc, or solid green) ---------- */
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
const GLYPHS = {
  shield: <><path {...stroke} d="M12 3.5 18.5 6v5.5c0 4.2-2.8 7-6.5 8.5-3.7-1.5-6.5-4.3-6.5-8.5V6z" /><path {...stroke} d="m9 12 2.2 2.2L15.2 10" /></>,
  scale: <><path {...stroke} d="M12 4v15M8 19h8M5.5 7.5h13" /><path {...stroke} d="M5.5 7.5 3.3 12.5a2.3 2.3 0 0 0 4.4 0z" /><path {...stroke} d="m18.5 7.5-2.2 5a2.3 2.3 0 0 0 4.4 0z" /><circle cx="12" cy="4.5" r="1.1" fill="currentColor" /></>,
  truck: <><path fill="currentColor" d="M2.5 7a1 1 0 0 1 1-1h9.5a1 1 0 0 1 1 1v8.5h-11.5z" /><path fill="currentColor" d="M14.5 9.5h3.6l3.4 3.6v2.4h-7z" /><circle cx="7" cy="17.3" r="1.9" fill="currentColor" /><circle cx="17.5" cy="17.3" r="1.9" fill="currentColor" /></>,
};
const SOLID = {
  tag: <><path fill="currentColor" d="M3 12.6V4.5A1.5 1.5 0 0 1 4.5 3h8.1a1.5 1.5 0 0 1 1.06.44l6.9 6.9a1.5 1.5 0 0 1 0 2.12l-8.1 8.1a1.5 1.5 0 0 1-2.12 0l-6.9-6.9A1.5 1.5 0 0 1 3 12.6z" /><circle cx="8" cy="8" r="1.6" fill="#fff" /></>,
  check: <><circle cx="12" cy="12" r="9.5" fill="currentColor" /><path d="m7.8 12.3 2.8 2.8 5.6-5.8" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></>,
  users: <><circle cx="12" cy="7" r="3.2" fill="currentColor" /><circle cx="5.5" cy="8.5" r="2.4" fill="currentColor" /><circle cx="18.5" cy="8.5" r="2.4" fill="currentColor" /><path fill="currentColor" d="M6 19.5c0-3.6 2.7-6 6-6s6 2.4 6 6zM1.5 18.5c0-2.6 1.7-4.4 4-4.4.8 0 1.5.2 2.1.6-1.2 1.1-2 2.5-2.2 3.8zM22.5 18.5c0-2.6-1.7-4.4-4-4.4-.8 0-1.5.2-2.1.6 1.2 1.1 2 2.5 2.2 3.8z" /></>,
  shield: <><path fill="currentColor" d="M12 2.5 20 5.6v6.2c0 5-3.4 8.4-8 10.2-4.6-1.8-8-5.2-8-10.2V5.6z" /><path d="m8.4 12 2.6 2.6 4.6-4.8" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></>,
  truck: GLYPHS.truck,
};
const Svg = ({ children, className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">{children}</svg>
);

const POINT_ICONS = ["shield", "scale", "truck"];

const TRUST = [
  { icon: "tag", title: "100% Free", text: "No hidden fees" },
  { icon: "check", title: "No Obligation", text: "Get quotes with zero pressure" },
  { icon: "users", title: "UK Specialists", text: "20+ vetted experts" },
  { icon: "shield", title: "12-Month Warranty", text: "As standard" },
  { icon: "truck", title: "Nationwide Delivery", text: "Supply & fit available" },
];

// trust point text continues its title ("every garage ...") - shown as its own sentence
const sentence = (t = "") => t.charAt(0).toUpperCase() + t.slice(1);

export default function TrustCta({ data, car = null, engine = "/variant/sec10_engine.webp", engineCode = "", engineDesc = "" }) {
  if (!data) return null;
  const label = (data.ctaButton?.label || "Compare Engine Prices Now").replace(/\s*→\s*$/, "");
  // the final CTA copy is a headline sentence followed by supporting copy
  const finalCta = data.finalCta || "";
  const stop = finalCta.indexOf(". ");
  const heading = stop === -1 ? finalCta : finalCta.slice(0, stop + 1);
  const rest = stop === -1 ? "" : finalCta.slice(stop + 2);

  return (
    <section className="relative overflow-hidden bg-[#f6f5f1] text-[#141a13]">
      <div className="relative mx-auto max-w-8xl px-4 py-10 sm:px-6 md:px-8 md:py-14">
        <div className="flex items-center gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8a6a1f] md:text-[13px]">Why Choose Us</p>
          <span className="h-px w-10 md:w-14" style={{ background: GOLD }} aria-hidden="true" />
        </div>
        {data.h2 && (
          <h2 className="mt-2 text-[27px] leading-[1.15] text-[#141a13] sm:text-[34px] lg:text-[42px]" style={SERIF}>
            {data.h2}
          </h2>
        )}

        {/* trust cards */}
        {data.trustPoints?.length > 0 && (
          <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-3 md:gap-4">
            {data.trustPoints.map((c, i) => (
              <article key={c.title} className="flex gap-4 rounded-xl border border-[#e6e2d8] bg-white p-4 shadow-[0_8px_24px_-18px_rgba(31,61,36,0.4)] md:p-5 lg:gap-5 lg:p-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white md:h-16 md:w-16 lg:h-[72px] lg:w-[72px]" style={{ background: INK }}>
                  <Svg className="h-7 w-7 md:h-8 md:w-8">{GLYPHS[POINT_ICONS[i % POINT_ICONS.length]]}</Svg>
                </span>
                <div className="min-w-0">
                  <h3 className="text-[19px] leading-[1.22] md:text-[20px] lg:text-[23px]" style={SERIF} dangerouslySetInnerHTML={{ __html: c.title }} />
                  <p className="mt-2 text-[14px] leading-[1.6] text-[#2b3229]" dangerouslySetInnerHTML={{ __html: sentence(c.text) }} />
                </div>
              </article>
            ))}
          </div>
        )}

        {/* banner: dark feature card - car on the dusk highland photo, the final CTA, engine plate */}
        {(data.finalCta || data.ctaButton) && (
          <div className="relative mt-4 overflow-hidden rounded-2xl border border-[#1f2a1c] bg-[#0d110c] text-white shadow-[0_30px_60px_-30px_rgba(13,17,12,0.75)] md:mt-5">
            <div className="relative grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,0.62fr)]">
              <div className="relative aspect-[16/11] sm:aspect-[16/9] md:aspect-auto md:min-h-[320px]">
                <PhotoScene car={car} ground={10} carClass="left-1/2 w-[78%] -translate-x-1/2 md:w-[84%]" position="20% 62%" sizes="(min-width: 768px) 45vw, 100vw" />
                {/* blend the photo into the card under the copy */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] md:hidden" style={{ background: "linear-gradient(to top, #0d110c, transparent)" }} aria-hidden="true" />
                <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[22%] md:block" style={{ background: "linear-gradient(to left, #0d110c, transparent)" }} aria-hidden="true" />
              </div>

              <div className="relative px-5 pb-7 pt-3 md:flex md:flex-col md:justify-center md:py-10 md:pl-4 md:pr-8 lg:pr-6">
                {heading && (
                  <h3 className="text-[25px] leading-[1.2] text-white sm:text-[28px] md:text-[29px] lg:text-[32px]" style={SERIF} dangerouslySetInnerHTML={{ __html: heading }} />
                )}
                {rest && <p className="mt-3 text-[15px] leading-[1.65] text-white/75 md:text-[16px]" dangerouslySetInnerHTML={{ __html: rest }} />}
                <Link
                  href="/quote"
                  className="group mt-5 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#5a7a3c] bg-[#3e5a2c] px-4 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(90,122,60,0.8)] transition-colors hover:bg-[#4a6a35] sm:w-auto sm:self-start sm:justify-start md:mt-6 md:text-[16px]"
                >
                  <span className="lg:hidden">Compare Engine Prices Now</span>
                  <span className="hidden lg:inline">{label}</span>
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 12h16M14 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>

              <div className="hidden border-l border-white/10 p-4 lg:block">
                <EnginePlate engine={engine} code={engineCode} desc={engineDesc} vertical className="h-full" />
              </div>
            </div>
          </div>
        )}

        {/* trust bar */}
        <ul className="mt-4 grid grid-cols-1 gap-x-3 gap-y-4 rounded-xl border border-[#e6e2d8] bg-white p-4 shadow-[0_8px_24px_-18px_rgba(31,61,36,0.4)] min-[380px]:grid-cols-2 sm:grid-cols-3 md:mt-5 lg:grid-cols-5 lg:divide-x lg:divide-[#ece8df] lg:px-2 lg:py-4">
          {TRUST.map((t, i) => (
            <li key={t.title} className={`flex items-center gap-3 lg:justify-center lg:px-3 ${i === TRUST.length - 1 ? "min-[380px]:col-span-2 sm:col-span-1" : ""}`}>
              <span style={{ color: INK }}>
                <Svg className="h-8 w-8 shrink-0 md:h-9 md:w-9">{SOLID[t.icon]}</Svg>
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold leading-tight text-[#141a13]">{t.title}</span>
                <span className="block text-[12.5px] leading-snug text-[#4a5048]">{t.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
