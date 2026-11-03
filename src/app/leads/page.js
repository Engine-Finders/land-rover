import { CRM_LEAD_FIELDS } from "@/app/api/lead/crm";
import { LEAD_SOURCE, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/app/api/lead/constants";

export const metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function fetchLeads() {
  if (!SUPABASE_ANON_KEY) {
    return { leads: [], error: "SUPABASE_ANON_KEY is not configured" };
  }

  const url = new URL(`${SUPABASE_URL}/rest/v1/leads`);
  url.searchParams.set("source", `eq.${LEAD_SOURCE}`);
  url.searchParams.set("order", "createdAt.desc");
  url.searchParams.set("select", "*");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
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
    return { leads: [], error: typeof message === "string" ? message : "Failed to fetch leads" };
  }

  return { leads: Array.isArray(data) ? data : [], error: null };
}

function cell(value) {
  if (value === undefined || value === null || String(value).trim() === "") return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default async function LeadsPage() {
  const { leads, error } = await fetchLeads();

  const columns = [
    { key: "createdAt", label: "Created" },
    ...CRM_LEAD_FIELDS,
  ];

  return (
    <main className="mx-auto w-full max-w-8xl px-3 py-6 text-[var(--color-text)] md:px-6 md:py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]">Leads</p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">Website leads</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Source filter: <strong>{LEAD_SOURCE}</strong>
            {leads.length ? ` · ${leads.length} row${leads.length === 1 ? "" : "s"}` : null}
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-5 rounded border border-[var(--color-accent-red)]/40 bg-[var(--color-accent-red-soft)] px-4 py-3 text-sm text-[var(--color-accent-red)]">
          {error}
        </div>
      ) : null}

      {!error && leads.length === 0 ? (
        <div className="mt-5 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
          No leads found for <strong>{LEAD_SOURCE}</strong> yet.
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
