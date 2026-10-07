/** Shared lead constants for this website. */

export const LEAD_SOURCE = "landroverengines.uk";

export const SUPABASE_WEBHOOK_URL =
  process.env.SUPABASE_WEBHOOK_URL ||
  process.env.LEAD_API_URL ||
  "https://gfrnxvolaqbfalerfhsr.supabase.co/functions/v1/receive-lead";

export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

export const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://gfrnxvolaqbfalerfhsr.supabase.co";
