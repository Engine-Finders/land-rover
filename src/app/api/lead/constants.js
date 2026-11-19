/** Shared lead constants for this website. */

export const LEAD_SOURCE = "landroverengines.uk";

export const SUPABASE_WEBHOOK_URL =
  process.env.SUPABASE_WEBHOOK_URL ||
  process.env.LEAD_API_URL ||
  "https://invfhqaqjyvcttppnygs.supabase.co/functions/v1/receive-lead";

export const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImludmZocWFxanl2Y3R0cHBueWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NTQ1NzAsImV4cCI6MjEwODQzMDU3MH0.GhZh0SG555phXYSdaP7bXPoxWN_QBhMusNJyQyDA-Rs";

export const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://invfhqaqjyvcttppnygs.supabase.co";

/** Second Supabase project — keep DB1 above unchanged; leads go to both. */
export const SUPABASE_WEBHOOK_URL_2 =
  process.env.SUPABASE_WEBHOOK_URL_2 ||
  process.env.LEAD_API_URL_2 ||
  "https://ommfysqqlewadjqtbigk.supabase.co/functions/v1/receive-lead";

export const SUPABASE_ANON_KEY_2 =
  process.env.SUPABASE_ANON_KEY_2 ||
  "sb_publishable_iSReiPMDrICyL2GXD_sQ3g_ITSi3hLF";

export const SUPABASE_URL_2 =
  process.env.SUPABASE_URL_2 || "https://ommfysqqlewadjqtbigk.supabase.co";

export function getSupabaseConfig(db = "1") {
  if (String(db) === "2") {
    return {
      db: "2",
      label: "DB2",
      url: SUPABASE_URL_2,
      anonKey: SUPABASE_ANON_KEY_2,
      webhookUrl: SUPABASE_WEBHOOK_URL_2,
    };
  }
  return {
    db: "1",
    label: "DB1",
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
    webhookUrl: SUPABASE_WEBHOOK_URL,
  };
}
