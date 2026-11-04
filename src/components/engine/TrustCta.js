import Link from "next/link";
import { CONTAINER, SANS } from "@/components/engine/engineTheme";

const CARD = "rounded-xl border border-lr-line bg-lr-card shadow-[0_14px_30px_-26px_var(--lr-shadow)] dark:bg-[linear-gradient(180deg,#17302a_0%,#12271f_100%)]";
import { BODY_SM, H2, H5, H6, LABEL } from "@/lib/typeScale";

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
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-lr-line bg-lr-chip text-lr-green md:h-14 md:w-14 xl:h-[62px] xl:w-[62px]">
      <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8 xl:h-[37px] xl:w-[37px]" aria-hidden="true">
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
  return { title, rest: rest.replace(/(get back on the road with confidence)/i, `<span class="text-lr-green">$1</span>`) };
}

export default function TrustCta({ data }) {
  if (!data) return null;
  const points = (data.trustPoints || []).map(parsePoint);
  const { title, rest } = splitFinal(data.finalCta || "");
  const label = (data.ctaButton?.label || "Compare Engine Prices Now").replace(/\s*→\s*$/, "").replace(/^Compare Land Rover /i, "Compare ");

  return (
    <section className="relative bg-lr-page text-lr-head" style={SANS}>
      <div className={`${CONTAINER} pb-12 pt-10 md:pb-16 md:pt-14 xl:pb-16 xl:pt-8`}>
        {points.length > 0 && (
          <>
            <header className="mb-6 md:mb-8">
              <p className={`flex items-center gap-3 ${LABEL} text-lr-green`}>
                <span className="h-px w-7 bg-current xl:w-[24px]" aria-hidden="true" />
                Trust &amp; Proof
              </p>
              <h2 className={`mt-2.5 ${H2} text-lr-head xl:mt-3`}>Why Owners Trust Us</h2>
            </header>
            <ul className="grid gap-3 md:grid-cols-3 md:gap-4 xl:gap-[22px]">
              {points.map((p) => (
                <li key={p.title} className={`${CARD} flex items-start gap-4 px-4 py-4 md:flex-col md:gap-3 md:px-5 md:py-5 xl:flex-row xl:gap-[24px] xl:pb-[8px] xl:pl-[14px] xl:pr-[16px] xl:pt-[14px]`}>
                  <TrustIcon title={p.title} />
                  <div className="min-w-0">
                    <h3 className={`${H6} text-lr-head xl:pt-[2px]`}>{p.title}</h3>
                    <p className={`mt-1.5 ${BODY_SM} text-lr-body xl:mt-[6px]`} dangerouslySetInnerHTML={{ __html: dash(p.text) }} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {(title || data.ctaButton) && (
          <div className="relative mt-5 overflow-hidden rounded-2xl border border-lr-line bg-lr-panel px-5 dark:bg-[linear-gradient(100deg,#183229_0%,#142b23_45%,#11251e_100%)] py-5 md:mt-6 md:px-7 md:py-6 xl:mt-6 xl:flex xl:items-center xl:gap-[18px] xl:rounded-[12px] xl:py-[10px] xl:pl-[22px] xl:pr-[20px]">
            {/* soft green glow behind the shield */}
            <span className="pointer-events-none absolute -left-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(123,196,126,0.16),transparent_70%)]" aria-hidden="true" />
            <div className="relative flex items-start gap-4 md:items-center xl:min-w-0 xl:flex-1 xl:gap-[21px]">
              <svg viewBox="3.6 1.8 16.8 20.4" className="h-12 w-10 shrink-0 md:h-14 md:w-12 xl:h-[58px] xl:w-[48px]" aria-hidden="true" style={{ color: "var(--lr-green)" }}>
                <path {...line} strokeWidth="1.4" d="M12 2.6 19.6 5.6v6c0 4.7-3.2 8-7.6 9.8-4.4-1.8-7.6-5.1-7.6-9.8v-6z" />
                <path {...line} strokeWidth="1.6" d="m8.6 12 2.4 2.4 4.5-4.7" />
              </svg>
              <span className="hidden h-[52px] w-px shrink-0 bg-lr-line xl:block" aria-hidden="true" />
              <div className="min-w-0">
                {title && <p className={`${H5} text-lr-head`}>{title}</p>}
                {rest && <p className={`mt-1.5 ${BODY_SM} text-lr-body xl:mt-[6px]`} dangerouslySetInnerHTML={{ __html: rest }} />}
              </div>
            </div>
            <Link
              href="/quote"
              className="group relative mt-4 flex items-center justify-center gap-2.5 rounded-lg border border-lr-brand bg-lr-brand px-5 py-3.5 text-center text-[15px] font-medium leading-snug text-lr-on-brand shadow-[0_10px_26px_-14px_rgba(31,112,73,0.8)] transition-colors hover:bg-lr-brand-hover md:mt-5 md:w-fit md:px-7 xl:mt-0 xl:shrink-0 xl:px-[17px] xl:py-[14px] xl:text-[17px]"
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
