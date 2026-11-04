import Link from "next/link";
import Image from "next/image";
import VIcon from "@/components/variant/VariantIcons";
import { carRatio } from "@/lib/carGeometry";
import { stripArrow, stripBullet, topicIcon } from "@/components/variant/variantText";

// Variant section: "Repair, Buy, or Replace?" - repairability table, buy/avoid checklist,
// closing verdict, compare CTA and trust strip, from the page's `repairBuyOrReplace` JSON.
// Fixed dark editorial design (serif headings, gold accents).

const GREEN = "#8fb35a";
const GOLD = "#c9a24a";
const SERIF = { fontFamily: "var(--font-serif-display), Georgia, 'Times New Roman', serif" };

const STATUS = {
  yes: { color: "#7fbf5a", mark: "check" },
  partial: { color: "#e3b04b", mark: "check" },
  no: { color: "#ef5b4f", mark: "cross" },
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
    <span className={`inline-flex items-center gap-1.5 font-medium ${className}`} style={{ color: ok === "no" ? s.color : undefined }}>
      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full" style={{ background: s.color }}>
        <svg viewBox="0 0 24 24" className="h-3 w-3 text-[#0b0d0a]" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {s.mark === "check" ? <path d="m6 12.5 4 4 8-9" /> : <path d="M7 7l10 10M17 7 7 17" />}
        </svg>
      </span>
      <span className={ok === "no" ? "" : "text-white"}>{label}</span>
    </span>
  );
}

function Card({ className = "", children }) {
  return <div className={`rounded-xl border border-white/12 bg-[#0f130e]/90 backdrop-blur-sm ${className}`}>{children}</div>;
}

function CardTitle({ icon, children }) {
  return (
    <h3 className="flex items-center gap-3 text-[20px] leading-tight text-white md:text-[24px]" style={SERIF}>
      <VIcon name={icon} className="h-6 w-6 shrink-0 md:h-7 md:w-7" style={{ color: GOLD }} />
      <span dangerouslySetInnerHTML={{ __html: children }} />
    </h3>
  );
}

function CheckList({ tone, title, items }) {
  if (!items?.length) return null;
  const good = tone === "buy";
  const c = good
    ? { border: "rgba(127,191,90,0.35)", bg: "linear-gradient(180deg, rgba(36,58,30,0.55) 0%, rgba(16,24,14,0.6) 100%)", head: "#7fbf5a", iconBg: "rgba(127,191,90,0.12)" }
    : { border: "rgba(239,91,79,0.35)", bg: "linear-gradient(180deg, rgba(70,26,22,0.55) 0%, rgba(26,14,12,0.6) 100%)", head: "#ef5b4f", iconBg: "rgba(239,91,79,0.12)" };
  return (
    <div className="rounded-lg border p-3.5 md:p-4" style={{ borderColor: c.border, background: c.bg }}>
      <p className="flex items-center gap-2.5 border-b border-white/10 pb-3 text-[19px] md:text-[21px]" style={{ ...SERIF, color: c.head }}>
        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
          <svg viewBox="0 0 24 24" className="absolute inset-0 h-7 w-7" aria-hidden="true">
            <path fill="currentColor" d="M12 2.5l8 3.3v6.3c0 5-3.4 8.4-8 10.4-4.6-2-8-5.4-8-10.4V5.8z" />
          </svg>
          <svg viewBox="0 0 24 24" className="relative h-3.5 w-3.5 text-[#0b0d0a]" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {good ? <path d="m6 12.5 4 4 8-9" /> : <path d="M7 7l10 10M17 7 7 17" />}
          </svg>
        </span>
        {title}
      </p>
      <ul className="divide-y divide-white/10">
        {items.map((raw) => {
          const text = stripBullet(raw);
          return (
            <li key={text} className="flex items-start gap-3 py-3 last:pb-0.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: c.iconBg, color: c.head }}>
                <VIcon name={topicIcon(text)} className="h-[18px] w-[18px]" />
              </span>
              <p className="pt-1 text-[14px] leading-snug text-white/90 md:text-[14.5px]" dangerouslySetInnerHTML={{ __html: text }} />
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
    <section className="relative overflow-hidden bg-[#0b0d0a] text-white">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] md:h-[520px]" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 70% at 75% 25%, rgba(92,110,84,0.30) 0%, rgba(40,48,36,0.15) 50%, transparent 78%)" }} />
        <svg className="absolute right-0 top-[18%] h-[50%] w-full opacity-75 lg:top-[8%] lg:h-[62%] lg:w-[60%]" viewBox="0 0 800 400" preserveAspectRatio="none">
          <path d="M0 230 C120 140 220 100 340 130 S540 40 640 80 S760 120 800 100 V400 H0Z" fill="#161b15" />
          <path d="M0 290 C150 230 270 215 390 235 S610 170 800 200 V400 H0Z" fill="#12160f" />
          <path d="M0 340 C160 300 300 300 440 312 S660 282 800 292 V400 H0Z" fill="#1a160f" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-b from-transparent to-[#0b0d0a]" />
      </div>

      <div className="relative mx-auto max-w-8xl border-t border-white/10 px-4 pb-10 pt-10 sm:px-6 md:px-8 md:pb-14 md:pt-14">
        {/* ---------- header ---------- */}
        <div className="grid items-center gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-10">
          <div>
            <span className="block h-0.5 w-14 md:w-20" style={{ background: GOLD }} aria-hidden="true" />
            <h2 className="mt-4 text-[32px] leading-[1.08] tracking-[-0.01em] text-white sm:text-[42px] md:mt-5 lg:text-[52px] xl:text-[58px]" style={SERIF}>
              {lead && (
                <>
                  {cut > 0 ? `${lead.slice(0, cut)} ` : ""}
                  <span style={{ color: GREEN }}>{cut > 0 ? lead.slice(cut + 1) : lead}</span> —<br />
                </>
              )}
              {tail}
            </h2>
          </div>
          {car && (
            <div className="relative flex justify-center lg:justify-end" aria-hidden="true">
              <div className="relative w-[82%] max-w-[380px] sm:max-w-[440px] lg:w-full lg:max-w-[560px]" style={{ aspectRatio: carRatio(car) }}>
                <div className="absolute inset-x-[10%] bottom-[1%] h-[12%] rounded-[50%] bg-black/85 blur-xl" />
                <Image src={car} alt="" fill sizes="(min-width: 1024px) 40vw, 82vw" className="object-fill drop-shadow-[0_24px_30px_rgba(0,0,0,0.6)]" />
              </div>
            </div>
          )}
        </div>

        {/* ---------- repair + buy ---------- */}
        <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-2 lg:gap-5">
          {repair?.rows?.length > 0 && (
            <Card className="p-4 md:p-5">
              <CardTitle icon="wrench">{repair.title || "Can It Be Repaired?"}</CardTitle>

              {/* mobile list */}
              <ul className="mt-4 divide-y divide-white/10 rounded-lg border border-white/10 md:hidden">
                {repair.rows.map((r) => (
                  <li key={r.problem} className="flex gap-3 p-3">
                    <VIcon name={topicIcon(r.problem)} className="mt-0.5 h-7 w-7 shrink-0" style={{ color: GOLD }} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[14.5px] font-medium leading-snug text-white" dangerouslySetInnerHTML={{ __html: r.problem }} />
                        <StatusMark value={r.repairable} className="shrink-0 text-[12.5px]" />
                      </div>
                      <p className="mt-1 text-[13.5px] font-semibold" style={{ color: GREEN }}>{r.typicalCost}</p>
                      <p className="mt-0.5 text-[13px] leading-snug text-white/65" dangerouslySetInnerHTML={{ __html: r.whenItMakesSense }} />
                    </div>
                  </li>
                ))}
              </ul>

              {/* tablet / desktop table */}
              <div className="mt-4 hidden overflow-hidden rounded-lg border border-white/10 md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-white/[0.04] text-[13.5px] font-medium" style={{ color: GOLD }}>
                      <th scope="col" className="py-3 pl-[60px] pr-3">{cols[0]}</th>
                      <th scope="col" className="border-l border-white/10 px-3 py-3">{cols[1]}</th>
                      <th scope="col" className="border-l border-white/10 px-3 py-3 text-center">{cols[2]}</th>
                      <th scope="col" className="border-l border-white/10 px-3 py-3">{cols[3]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repair.rows.map((r) => (
                      <tr key={r.problem} className="border-t border-white/10 text-[14px]">
                        <th scope="row" className="py-3 pl-3 pr-3 font-normal">
                          <span className="flex items-center gap-3">
                            <VIcon name={topicIcon(r.problem)} className="h-8 w-8 shrink-0" style={{ color: GOLD }} />
                            <span className="leading-snug text-white" dangerouslySetInnerHTML={{ __html: r.problem }} />
                          </span>
                        </th>
                        <td className="border-l border-white/10 px-3 py-3"><StatusMark value={r.repairable} className="text-[14px]" /></td>
                        <td className={`border-l border-white/10 px-3 py-3 text-center leading-snug ${/replacement|rebuild/i.test(r.typicalCost) ? "text-[13px] text-white/85" : "whitespace-nowrap text-[15px] text-white"}`}>{r.typicalCost}</td>
                        <td className="border-l border-white/10 px-3 py-3 text-[13px] leading-snug text-white/80" dangerouslySetInnerHTML={{ __html: r.whenItMakesSense }} />
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
                    <stop offset="0" stopColor="#e5c77a" />
                    <stop offset="1" stopColor="#9c7a32" />
                  </linearGradient>
                  <linearGradient id="rbr-green" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#3c6b34" />
                    <stop offset="1" stopColor="#1d3a1c" />
                  </linearGradient>
                </defs>
                <path d="M32 2 60 12v20c0 18-12 30-28 38C16 62 4 50 4 32V12z" fill="url(#rbr-gold)" />
                <path d="M32 8 54 16v16c0 14.5-9.5 24.5-22 31.2C19.5 56.5 10 46.5 10 32V16z" fill="url(#rbr-green)" />
                <path d="m21 35 8 8 15-17" fill="none" stroke="url(#rbr-gold)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <h3 className="text-[24px] leading-tight text-white md:text-[30px]" style={SERIF}>Closing Verdict</h3>
                <p className="mt-2 text-[14.5px] leading-[1.65] text-white/85 md:text-[15.5px]" dangerouslySetInnerHTML={{ __html: data.closingVerdict }} />
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
              <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#0f130e] via-[#0f130e]/80 to-transparent" aria-hidden="true" />
              <div className="relative">
                <div className="flex items-center gap-4 md:gap-6">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 md:h-[72px] md:w-[72px]" style={{ borderColor: GOLD, color: GOLD }}>
                    <VIcon name="pound" className="h-7 w-7 md:h-9 md:w-9" />
                  </span>
                  <h3 className="text-[22px] leading-[1.2] text-white md:text-[30px]" style={SERIF}>
                    Don&apos;t guess. Get the right engine at the right price.
                  </h3>
                </div>
                <Link
                  href="/quote"
                  className="group mt-5 flex items-center gap-3.5 rounded-lg border border-[#7f9f4f]/60 bg-[#14200f]/80 px-4 py-3.5 text-[15px] font-medium leading-snug text-white transition-colors hover:border-[#8fb35a] hover:bg-[#1d2d16] md:mt-6 md:px-6 md:py-4 md:text-[17px] lg:max-w-[460px]"
                >
                  <VIcon name="arrow" className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
                  {stripArrow(data.cta.label)}
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* trust strip */}
        <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-3 rounded-xl border border-white/12 bg-white/[0.03] p-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:mt-5 lg:grid-cols-5 lg:divide-x lg:divide-white/10 lg:px-2">
          {TRUST.map((t) => (
            <li key={t.label} className="flex items-center gap-3 lg:justify-center lg:px-3">
              <VIcon name={t.icon} className="h-6 w-6 shrink-0" style={{ color: GOLD }} />
              <span className="text-[13.5px] leading-snug text-white/85">{t.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
