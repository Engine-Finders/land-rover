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
