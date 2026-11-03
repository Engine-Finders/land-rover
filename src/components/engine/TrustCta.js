import Link from "next/link";
import { CONTAINER, DARK, DARK_CARD, MINT, SANS } from "@/components/engine/engineTheme";

// Engine section: Why Owners Trust Us - three trust cards ("Title: text" points from the page's
// `trustCta` JSON) and the closing call-to-action bar with the quote button. Fixed dark design,
// straight under the FAQ on the same band. 2xl values are the reference design at 1536px; xl is
// the same layout scaled for 1280-1535px; md shows the cards three across; phones stack.

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

function TrustIcon({ title }) {
  const key = title.toLowerCase();
  const glyph = key.includes("compare") ? (
    <>
      <circle {...line} strokeWidth="2" cx="10.5" cy="10.5" r="6.5" />
      <path {...line} strokeWidth="2.4" d="m15.4 15.4 5.1 5.1" />
      <path {...line} strokeWidth="1.4" d="M7.6 9.2a3.4 3.4 0 0 1 2.4-2" />
    </>
  ) : key.includes("coverage") || key.includes("uk") ? (
    <path fill="currentColor" fillRule="evenodd" d="M12 2.5a7.2 7.2 0 0 0-7.2 7.2c0 5.3 6.2 11.2 6.5 11.5a1 1 0 0 0 1.4 0c.3-.3 6.5-6.2 6.5-11.5A7.2 7.2 0 0 0 12 2.5zm0 4.4a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6z" />
  ) : (
    <>
      <path {...line} strokeWidth="1.7" d="M12 2.8 19.4 5.7v5.9c0 4.6-3.1 7.8-7.4 9.6-4.3-1.8-7.4-5-7.4-9.6V5.7z" />
      <path {...line} strokeWidth="1.9" d="m8.6 12 2.4 2.4 4.5-4.7" />
    </>
  );
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#2a332f] bg-[#161d1a] md:h-14 md:w-14 xl:h-[62px] xl:w-[62px] 2xl:h-[72px] 2xl:w-[72px]" style={{ color: MINT }}>
      <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8 xl:h-[37px] xl:w-[37px] 2xl:h-[44px] 2xl:w-[44px]" aria-hidden="true">
        {glyph}
      </svg>
    </span>
  );
}

function parsePoint(point = "") {
  const i = point.indexOf(":");
  return i === -1 ? { title: point, text: "" } : { title: point.slice(0, i).trim(), text: point.slice(i + 1).trim() };
}

const dash = (t = "") => t.replace(/ - /g, " — ");

// "Find the best ... rely on. Compare real prices ... and get back on the road with confidence."
function splitFinal(text = "") {
  const at = text.indexOf(". ");
  const title = at === -1 ? text : text.slice(0, at + 1);
  const rest = at === -1 ? "" : text.slice(at + 2);
  return { title, rest: rest.replace(/(get back on the road with confidence)/i, `<span style="color:${MINT}">$1</span>`) };
}

export default function TrustCta({ data }) {
  if (!data) return null;
  const points = (data.trustPoints || []).map(parsePoint);
  const { title, rest } = splitFinal(data.finalCta || "");
  const label = (data.ctaButton?.label || "Compare Engine Prices Now").replace(/\s*→\s*$/, "").replace(/^Compare Land Rover /i, "Compare ");

  return (
    <section className="relative text-white" style={{ ...SANS, background: DARK }}>
      <div className={`${CONTAINER} pb-12 pt-4 md:pb-16 md:pt-6 xl:pb-[22px] xl:pt-0 2xl:pb-[26px] 2xl:pt-0`}>
        {points.length > 0 && (
          <div className="rounded-2xl border border-[#262e2a] bg-[#0a0f11] px-4 pb-4 pt-5 sm:px-5 md:px-6 md:pb-6 md:pt-6 xl:-mx-[13px] xl:rounded-[14px] xl:px-[27px] xl:pb-[14px] xl:pt-[8px] 2xl:-mx-[15px] 2xl:px-[31px] 2xl:pb-[16px] 2xl:pt-[9px]">
            <h2 className="flex items-center gap-3 text-[18px] leading-tight text-white md:text-[20px] xl:gap-[14px] xl:text-[17.5px] xl:leading-[22px] 2xl:gap-[16px] 2xl:text-[20px] 2xl:leading-[24px]" style={{ ...SANS, fontWeight: 600 }}>
              <span className="h-[2px] w-6 shrink-0 xl:w-[22px] 2xl:w-[25px]" style={{ background: "#749278" }} aria-hidden="true" />
              Why Owners Trust Us
            </h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-3 md:gap-4 xl:mt-[5px] xl:gap-[22px] 2xl:mt-[6px] 2xl:gap-[26px]">
              {points.map((p) => (
                <li key={p.title} className={`${DARK_CARD} flex items-start gap-4 px-4 py-4 md:flex-col md:gap-3 md:px-5 md:py-5 xl:flex-row xl:gap-[24px] xl:pb-[8px] xl:pl-[14px] xl:pr-[16px] xl:pt-[14px] 2xl:gap-[24px] 2xl:pb-[10px] 2xl:pl-[16px] 2xl:pr-[18px] 2xl:pt-[16px]`}>
                  <TrustIcon title={p.title} />
                  <div className="min-w-0">
                    <h3 className="text-[16.5px] font-semibold leading-tight text-white md:text-[17.5px] xl:pt-[2px] xl:text-[16px] xl:leading-[21px] 2xl:pt-[2px] 2xl:text-[18.5px] 2xl:leading-[24px]">{p.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-[1.55] text-[#c3cac6] md:text-[14.5px] xl:mt-[5px] xl:text-[13px] xl:leading-[20px] 2xl:mt-[6px] 2xl:text-[15px] 2xl:leading-[23px]" dangerouslySetInnerHTML={{ __html: dash(p.text) }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(title || data.ctaButton) && (
          <div className="relative mt-3 overflow-hidden rounded-2xl border border-[#263129] bg-[linear-gradient(100deg,#13211a_0%,#101a16_45%,#0d1513_100%)] px-5 py-5 md:mt-4 md:px-7 md:py-6 xl:mx-[14px] xl:mt-[13px] xl:flex xl:items-center xl:gap-[18px] xl:rounded-[12px] xl:py-[10px] xl:pl-[22px] xl:pr-[20px] 2xl:mx-[16px] 2xl:mt-[15px] 2xl:gap-[22px] 2xl:py-[12px] 2xl:pl-[24px] 2xl:pr-[20px]">
            {/* soft green glow behind the shield */}
            <span className="pointer-events-none absolute -left-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(123,196,126,0.16),transparent_70%)]" aria-hidden="true" />
            <div className="relative flex items-start gap-4 md:items-center xl:min-w-0 xl:flex-1 xl:gap-[21px] 2xl:gap-[24px]">
              <svg viewBox="3.6 1.8 16.8 20.4" className="h-12 w-10 shrink-0 md:h-14 md:w-12 xl:h-[58px] xl:w-[48px] 2xl:h-[68px] 2xl:w-[56px]" aria-hidden="true" style={{ color: MINT }}>
                <path {...line} strokeWidth="1.4" d="M12 2.6 19.6 5.6v6c0 4.7-3.2 8-7.6 9.8-4.4-1.8-7.6-5.1-7.6-9.8v-6z" />
                <path {...line} strokeWidth="1.6" d="m8.6 12 2.4 2.4 4.5-4.7" />
              </svg>
              <span className="hidden h-[52px] w-px shrink-0 bg-[#2a3530] xl:block 2xl:h-[60px]" aria-hidden="true" />
              <div className="min-w-0">
                {title && <p className="text-[16.5px] font-semibold leading-[1.35] text-white md:text-[18px] xl:text-[16px] xl:leading-[22px] 2xl:text-[18.3px] 2xl:leading-[25px]">{title}</p>}
                {rest && <p className="mt-1.5 text-[14px] leading-[1.55] text-[#c3cac6] md:text-[15px] xl:mt-[6px] xl:text-[13.5px] xl:leading-[19px] 2xl:mt-[7px] 2xl:text-[15.4px] 2xl:leading-[21px]" dangerouslySetInnerHTML={{ __html: rest }} />}
              </div>
            </div>
            <Link
              href="/quote"
              className="group relative mt-4 flex items-center justify-center gap-2.5 rounded-lg border border-[#3b6b43] bg-[linear-gradient(180deg,#2f5c35_0%,#264b2b_100%)] px-5 py-3.5 text-center text-[15px] font-medium leading-snug text-white shadow-[0_10px_26px_-12px_rgba(63,120,70,0.8)] transition-colors hover:bg-[linear-gradient(180deg,#356a3c_0%,#2b5531_100%)] md:mt-5 md:w-fit md:px-7 xl:mt-0 xl:shrink-0 xl:px-[17px] xl:py-[14px] xl:text-[15px] 2xl:px-[20px] 2xl:py-[15px] 2xl:text-[17.5px]"
            >
              {label}
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12h16M14 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
