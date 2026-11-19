import Link from "next/link";
import { CRM_LEAD_FIELDS } from "@/app/api/lead/crm";
import { getSupabaseConfig, LEAD_SOURCE } from "@/app/api/lead/constants";

export const metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function fetchLeads(db = "1") {
  const config = getSupabaseConfig(db);

  if (!config.anonKey) {
    return { leads: [], error: `${config.label} anon key is not configured`, config };
  }

  const url = new URL(`${config.url}/rest/v1/leads`);
  url.searchParams.set("source", `eq.${LEAD_SOURCE}`);
  url.searchParams.set("order", "createdAt.desc");
  url.searchParams.set("select", "*");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.anonKey}`,
      apikey: config.anonKey,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : [];
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message || data?.error || data?.hint || text || `Failed to fetch leads (${response.status})`;
    return {
      leads: [],
      error: typeof message === "string" ? message : "Failed to fetch leads",
      config,
    };
  }

  return { leads: Array.isArray(data) ? data : [], error: null, config };
}

function cell(value) {
  if (value === undefined || value === null || String(value).trim() === "") return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default async function LeadsPage(props) {
  const searchParams = await props.searchParams;
  const db = searchParams?.db === "2" ? "2" : "1";
  const { leads, error, config } = await fetchLeads(db);

  const columns = [
    { key: "createdAt", label: "Created" },
    ...CRM_LEAD_FIELDS,
  ];

  const btnBase =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-bold no-underline transition-colors";
  const btnActive = `${btnBase} bg-[var(--color-primary)] text-white`;
  const btnIdle = `${btnBase} border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]`;

  return (
    <main className="mx-auto w-full max-w-8xl px-3 py-6 text-[var(--color-text)] md:px-6 md:py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]">Leads</p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">Website leads</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Viewing <strong>{config.label}</strong> · Source filter: <strong>{LEAD_SOURCE}</strong>
            {leads.length ? ` · ${leads.length} row${leads.length === 1 ? "" : "s"}` : null}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/leads?db=1" className={db === "1" ? btnActive : btnIdle}>
            DB1
          </Link>
          <Link href="/leads?db=2" className={db === "2" ? btnActive : btnIdle}>
            DB2
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mt-5 rounded border border-[var(--color-accent-red)]/40 bg-[var(--color-accent-red-soft)] px-4 py-3 text-sm text-[var(--color-accent-red)]">
          {error}
        </div>
      ) : null}

      {!error && leads.length === 0 ? (
        <div className="mt-5 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
          No leads found for <strong>{LEAD_SOURCE}</strong> on {config.label} yet.
        </div>
      ) : null}

      {leads.length > 0 ? (
        <div className="mt-5 overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_8px_24px_var(--color-shadow)]">
          <table className="min-w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="bg-[var(--color-chrome)] text-white">
                {columns.map((col) => (
                  <th key={col.key} className="whitespace-nowrap border-r border-white/15 px-2.5 py-2 font-bold last:border-r-0">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr key={lead.id || `${lead.email}-${index}`} className="border-t border-[var(--color-border)]">
                  {columns.map((col) => (
                    <td key={col.key} className="max-w-[220px] truncate whitespace-nowrap px-2.5 py-2 align-top text-[var(--color-text)]">
                      {col.key === "createdAt" && lead[col.key]
                        ? new Date(lead[col.key]).toLocaleString("en-GB")
                        : cell(lead[col.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </main>
  );
}
