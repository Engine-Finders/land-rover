import Link from "next/link";
import Image from "next/image";
import VIcon from "@/components/variant/VariantIcons";
import { carRatio } from "@/lib/carGeometry";
import { stripArrow, stripBullet, topicIcon } from "@/components/variant/variantText";
import { BODY, BODY_SM, CONTAINER, H2, H5, H6, SMALL } from "@/lib/typeScale";

// Variant section: "Repair, Buy, or Replace?" - repairability table, buy/avoid checklist,
// closing verdict, compare CTA and trust strip, from the page's `repairBuyOrReplace` JSON.
// Editorial design (serif headings, gold accents) that follows the site theme (day / night).

const STATUS = {
  yes: { disc: "bg-lr-good", mark: "check" },
  partial: { disc: "bg-lr-warn", mark: "check" },
  no: { disc: "bg-lr-bad", mark: "cross" },
};

const TRUST = [
  { icon: "users", label: "20+ Vetted Specialists UK Network" },
  { icon: "shield", label: "12-Month Warranty as Standard" },
  { icon: "truck", label: "Nationwide Delivery & Collection" },
  { icon: "pound", label: "Transparent Pricing, No Hidden Fees" },
  { icon: "star", label: "Thousands of Owners Helped" },
];

// "✅ Yes" / "❌ No" / "⚠️ Sometimes" -> status + label without the emoji
function repairable(value = "") {
  const label = value.replace(/^[^\p{L}\p{N}]+/u, "").trim() || value;
  if (value.includes("✅")) return { ok: "yes", label };
  if (value.includes("❌")) return { ok: "no", label };
  return { ok: "partial", label };
}

function StatusMark({ value, className = "" }) {
  const { ok, label } = repairable(value);
  const s = STATUS[ok];
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium ${ok === "no" ? "text-lr-bad" : ""} ${className}`}>
      <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${s.disc}`}>
        <svg viewBox="0 0 24 24" className="h-3 w-3 text-lr-page" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {s.mark === "check" ? <path d="m6 12.5 4 4 8-9" /> : <path d="M7 7l10 10M17 7 7 17" />}
        </svg>
      </span>
      <span className={ok === "no" ? "" : "text-lr-head"}>{label}</span>
    </span>
  );
}

function Card({ className = "", children }) {
  return <div className={`rounded-xl border border-lr-line bg-lr-card/90 shadow-[0_20px_44px_-34px_var(--lr-shadow)] backdrop-blur-sm ${className}`}>{children}</div>;
}

function CardTitle({ icon, children }) {
  return (
    <h3 className={`${H5} flex items-center gap-3 text-lr-head`}>
      <VIcon name={icon} className="h-6 w-6 shrink-0 text-lr-gold md:h-7 md:w-7" />
      <span dangerouslySetInnerHTML={{ __html: children }} />
    </h3>
  );
}

function CheckList({ tone, title, items }) {
  if (!items?.length) return null;
  const good = tone === "buy";
  const c = good
    ? { box: "border-lr-good/35 from-lr-good/[0.09] to-lr-good/[0.02]", head: "text-lr-good", icon: "bg-lr-good/12 text-lr-good" }
    : { box: "border-lr-bad/35 from-lr-bad/[0.09] to-lr-bad/[0.02]", head: "text-lr-bad", icon: "bg-lr-bad/12 text-lr-bad" };
  return (
    <div className={`rounded-lg border bg-linear-to-b p-3.5 md:p-4 ${c.box}`}>
      <p className={`${H6} flex items-center gap-2.5 border-b border-lr-line pb-3 ${c.head}`}>
        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
          <svg viewBox="0 0 24 24" className="absolute inset-0 h-7 w-7" aria-hidden="true">
            <path fill="currentColor" d="M12 2.5l8 3.3v6.3c0 5-3.4 8.4-8 10.4-4.6-2-8-5.4-8-10.4V5.8z" />
          </svg>
          <svg viewBox="0 0 24 24" className="relative h-3.5 w-3.5 text-lr-page" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {good ? <path d="m6 12.5 4 4 8-9" /> : <path d="M7 7l10 10M17 7 7 17" />}
          </svg>
        </span>
        {title}
      </p>
      <ul className="divide-y divide-lr-line">
        {items.map((raw) => {
          const text = stripBullet(raw);
          return (
            <li key={text} className="flex items-start gap-3 py-3 last:pb-0.5">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${c.icon}`}>
                <VIcon name={topicIcon(text)} className="h-[18px] w-[18px]" />
              </span>
              <p className={`${BODY_SM} pt-1 text-lr-body`} dangerouslySetInnerHTML={{ __html: text }} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function RepairBuyOrReplace({ data, car = null, engine = "/variant/sec10_engine.webp" }) {
  if (!data) return null;
  // "Defender D240 - Repair, Buy, or Replace?" -> "Defender" + green "D240"
  const h2 = data.h2 || "";
  const dash = h2.indexOf(" - ");
  const lead = (dash === -1 ? "" : h2.slice(0, dash)).trim();
  const tail = dash === -1 ? h2 : h2.slice(dash + 3);
  const cut = lead.lastIndexOf(" ");
  const repair = data.canItBeRepaired;
  const cols = repair?.columns?.length === 4 ? repair.columns : ["Problem", "Repairable?", "Typical Cost", "When It Makes Sense"];
  const checks = data.buyingChecks;

  return (
    <section className="relative overflow-hidden bg-lr-page text-lr-head">
      {/* backdrop: soft light and layered hills in the page's own tints */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] md:h-[520px]" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 70% at 75% 25%, color-mix(in srgb, var(--lr-line) 70%, transparent) 0%, color-mix(in srgb, var(--lr-line) 25%, transparent) 50%, transparent 78%)" }} />
        <svg className="absolute right-0 top-[18%] h-[50%] w-full opacity-75 [mask-image:linear-gradient(to_right,transparent,#000_35%)] lg:top-[8%] lg:h-[62%] lg:w-[60%]" viewBox="0 0 800 400" preserveAspectRatio="none">
          <path d="M0 230 C120 140 220 100 340 130 S540 40 640 80 S760 120 800 100 V400 H0Z" className="fill-lr-panel" />
          <path d="M0 290 C150 230 270 215 390 235 S610 170 800 200 V400 H0Z" className="fill-lr-band" />
          <path d="M0 340 C160 300 300 300 440 312 S660 282 800 292 V400 H0Z" className="fill-lr-card" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-b from-transparent to-lr-page" />
      </div>

      <div className={`relative ${CONTAINER} border-t border-transparent pb-10 pt-10 md:pb-14 md:pt-14`}>
        {/* ---------- header ---------- */}
        <div className="grid items-center gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-10">
          <div>
            <span className="block h-0.5 w-14 bg-lr-gold-line md:w-20" aria-hidden="true" />
            <h2 className={`${H2} mt-4 text-lr-head md:mt-5`}>
              {lead && (
                <>
                  {cut > 0 ? `${lead.slice(0, cut)} ` : ""}
                  <span className="text-lr-green">{cut > 0 ? lead.slice(cut + 1) : lead}</span> —<br />
                </>
              )}
              {tail}
            </h2>
          </div>
          {car && (
            <div className="relative flex justify-center lg:justify-end" aria-hidden="true">
              <div className="relative w-[82%] max-w-[380px] sm:max-w-[440px] lg:w-full lg:max-w-[560px]" style={{ aspectRatio: carRatio(car) }}>
                <div className="absolute inset-x-[10%] bottom-[1%] h-[12%] rounded-[50%] bg-black/35 blur-xl dark:bg-black/85" />
                <Image src={car} alt="" fill sizes="(min-width: 1024px) 40vw, 82vw" className="object-fill drop-shadow-[0_24px_30px_rgba(24,40,31,0.28)] dark:drop-shadow-[0_24px_30px_rgba(0,0,0,0.6)]" />
              </div>
            </div>
          )}
        </div>

        {/* ---------- repair + buy (stacked, so the repair table has room for its columns) ---------- */}
        <div className="mt-6 grid gap-4 lg:mt-8 lg:gap-5">
          {repair?.rows?.length > 0 && (
            <Card className="p-4 md:p-5">
              <CardTitle icon="wrench">{repair.title || "Can It Be Repaired?"}</CardTitle>

              {/* mobile list */}
              <ul className="mt-4 divide-y divide-lr-line rounded-lg border border-lr-line md:hidden">
                {repair.rows.map((r) => (
                  <li key={r.problem} className="flex gap-3 p-3">
                    <VIcon name={topicIcon(r.problem)} className="mt-0.5 h-7 w-7 shrink-0 text-lr-gold" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className={`${BODY_SM} font-medium text-lr-head`} dangerouslySetInnerHTML={{ __html: r.problem }} />
                        <StatusMark value={r.repairable} className={`${SMALL} shrink-0`} />
                      </div>
                      <p className={`${BODY_SM} mt-1 font-semibold text-lr-green`}>{r.typicalCost}</p>
                      <p className={`${BODY_SM} mt-0.5 text-lr-body`} dangerouslySetInnerHTML={{ __html: r.whenItMakesSense }} />
                    </div>
                  </li>
                ))}
              </ul>

              {/* tablet / desktop table */}
              <div className="mt-4 hidden overflow-hidden rounded-lg border border-lr-line md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className={`${SMALL} bg-lr-panel text-lr-gold [&>th]:font-medium`}>
                      <th scope="col" className="w-[28%] py-3 pl-[60px] pr-3">{cols[0]}</th>
                      <th scope="col" className="w-[16%] border-l border-lr-line px-3 py-3">{cols[1]}</th>
                      <th scope="col" className="w-[20%] border-l border-lr-line px-3 py-3 text-center">{cols[2]}</th>
                      <th scope="col" className="border-l border-lr-line px-3 py-3">{cols[3]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repair.rows.map((r) => (
                      <tr key={r.problem} className={`${BODY_SM} border-t border-lr-line`}>
                        <th scope="row" className="py-3 pl-3 pr-3 font-normal">
                          <span className="flex items-center gap-3">
                            <VIcon name={topicIcon(r.problem)} className="h-8 w-8 shrink-0 text-lr-gold" />
                            <span className="leading-snug text-lr-head" dangerouslySetInnerHTML={{ __html: r.problem }} />
                          </span>
                        </th>
                        <td className="border-l border-lr-line px-3 py-3"><StatusMark value={r.repairable} /></td>
                        <td className={`border-l border-lr-line px-3 py-3 text-center ${/replacement|rebuild/i.test(r.typicalCost) ? "text-lr-body" : "whitespace-nowrap font-medium text-lr-head"}`}>{r.typicalCost}</td>
                        <td className="border-l border-lr-line px-3 py-3 text-lr-body" dangerouslySetInnerHTML={{ __html: r.whenItMakesSense }} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {checks && (checks.buyIf?.length || checks.avoidIf?.length) ? (
            <Card className="p-4 md:p-5">
              <CardTitle icon="cart">{checks.title || "Check These First"}</CardTitle>
              <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
                <CheckList tone="buy" title="Buy If:" items={checks.buyIf} />
                <CheckList tone="avoid" title="Avoid If:" items={checks.avoidIf} />
              </div>
            </Card>
          ) : null}
        </div>

        {/* ---------- verdict + CTA ---------- */}
        <div className="mt-4 grid gap-4 lg:mt-5 lg:grid-cols-2 lg:gap-5">
          {data.closingVerdict && (
            <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 md:p-7">
              <svg viewBox="0 0 64 72" className="h-16 w-14 shrink-0 md:h-24 md:w-20" aria-hidden="true">
                <defs>
                  <linearGradient id="rbr-gold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" style={{ stopColor: "var(--lr-gold-line)" }} />
                    <stop offset="1" style={{ stopColor: "var(--lr-gold)" }} />
                  </linearGradient>
                  <linearGradient id="rbr-green" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" style={{ stopColor: "var(--lr-brand)" }} />
                    <stop offset="1" style={{ stopColor: "var(--lr-brand-hover)" }} />
                  </linearGradient>
                </defs>
                <path d="M32 2 60 12v20c0 18-12 30-28 38C16 62 4 50 4 32V12z" fill="url(#rbr-gold)" />
                <path d="M32 8 54 16v16c0 14.5-9.5 24.5-22 31.2C19.5 56.5 10 46.5 10 32V16z" fill="url(#rbr-green)" />
                <path d="m21 35 8 8 15-17" fill="none" stroke="url(#rbr-gold)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <h3 className={`${H5} text-lr-head`}>Closing Verdict</h3>
                <p className={`${BODY} mt-2 text-lr-body`} dangerouslySetInnerHTML={{ __html: data.closingVerdict }} />
              </div>
            </Card>
          )}

          {data.cta?.label && (
            <Card className="relative overflow-hidden p-5 md:p-7">
              <Image
                src={engine}
                alt=""
                width={504}
                height={495}
                sizes="260px"
                className="pointer-events-none absolute -right-8 top-1/2 h-auto w-[180px] -translate-y-1/2 opacity-25 sm:w-[220px] md:opacity-45 lg:w-[240px]"
                aria-hidden="true"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-lr-card via-lr-card/80 to-transparent" aria-hidden="true" />
              <div className="relative">
                <div className="flex items-center gap-4 md:gap-6">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-lr-gold-line text-lr-gold md:h-[72px] md:w-[72px]">
                    <VIcon name="pound" className="h-7 w-7 md:h-9 md:w-9" />
                  </span>
                  <h3 className={`${H5} text-lr-head`}>
                    Don&apos;t guess. Get the right engine at the right price.
                  </h3>
                </div>
                <Link
                  href="/quote"
                  className="group mt-5 flex items-center gap-3.5 rounded-lg border border-lr-green/50 bg-lr-brand/[0.08] px-4 py-3.5 text-[15px] font-medium leading-snug text-lr-head transition-colors hover:border-lr-green hover:bg-lr-brand/15 md:mt-6 md:px-6 md:py-4 md:text-[16px] xl:text-[17px] lg:max-w-[480px]"
                >
                  <VIcon name="arrow" className="h-6 w-6 shrink-0 text-lr-green transition-transform group-hover:translate-x-1" />
                  {stripArrow(data.cta.label)}
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* trust strip */}
        <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-3 rounded-xl border border-lr-line bg-lr-card p-4 shadow-[0_20px_44px_-34px_var(--lr-shadow)] min-[420px]:grid-cols-2 md:grid-cols-3 lg:mt-5 lg:grid-cols-5 lg:divide-x lg:divide-lr-line lg:px-2">
          {TRUST.map((t) => (
            <li key={t.label} className="flex items-center gap-3 lg:justify-center lg:px-3">
              <VIcon name={t.icon} className="h-6 w-6 shrink-0 text-lr-gold" />
              <span className={`${SMALL} text-lr-body`}>{t.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
