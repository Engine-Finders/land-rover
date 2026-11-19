import {
  LEAD_SOURCE,
  SUPABASE_ANON_KEY,
  SUPABASE_ANON_KEY_2,
  SUPABASE_WEBHOOK_URL,
  SUPABASE_WEBHOOK_URL_2,
} from "@/app/api/lead/constants";

function normalizeCapacity(raw) {
  if (!raw) return "";
  const cleaned = String(raw).replace(/[^\d.]/g, "");
  const num = Number(cleaned);
  if (!Number.isFinite(num) || num <= 0) return "";
  // DVLA often returns cc (e.g. 1995) - store as litres bucket like "2"
  return String(Math.round(num >= 100 ? num / 1000 : num));
}

/**
 * Build quote payload from form state (contact + vehicle + optional calculator / page URL).
 * Calculator is for email only; strip before CRM with toCrmLeadPayload().
 */
export function buildQuoteLeadPayload({ contact, vehicle, calculator = null, pageUrl = "" } = {}) {
  const vrm = String(vehicle?.vrm || "").replace(/\s+/g, "").toUpperCase();
  const series = vehicle?.series || "";
  const brand = vehicle?.brand || "";

  const payload = {
    name: contact?.name || "",
    email: contact?.email || "",
    number: contact?.phone || contact?.number || "",
    postcode: contact?.postcode || "",
    description: contact?.remarks || contact?.description || "",
    vehicle_brand: brand,
    vehicle_model: series || brand,
    vehicle_reg: vrm,
    vehicle_vrm: vrm,
    vehicle_series: series,
    vehicle_year: vehicle?.year || "",
    engine_capacity: normalizeCapacity(vehicle?.engineCapacity),
    fuel_type: vehicle?.fuelType || "",
    vehicle_part: "Engine",
    source: LEAD_SOURCE,
    page_url: String(pageUrl || "").trim(),
    honeypot: contact?.honeypot || "",
  };

  if (calculator && typeof calculator === "object") {
    payload.calculator = calculator;
  }

  return payload;
}

/** CRM-safe fields only (no calculator / honeypot). */
export function toCrmLeadPayload(payload = {}) {
  return {
    name: payload.name || "",
    email: payload.email || "",
    number: payload.number || "",
    postcode: payload.postcode || "",
    description: payload.description || "",
    vehicle_brand: payload.vehicle_brand || "",
    vehicle_model: payload.vehicle_model || "",
    vehicle_reg: payload.vehicle_reg || payload.vehicle_vrm || "",
    vehicle_vrm: payload.vehicle_vrm || payload.vehicle_reg || "",
    vehicle_series: payload.vehicle_series || "",
    vehicle_year: payload.vehicle_year || "",
    engine_capacity: payload.engine_capacity || "",
    fuel_type: payload.fuel_type || payload.fuelType || "",
    vehicle_part: payload.vehicle_part || "Engine",
    source: payload.source || LEAD_SOURCE,
    page_url: payload.page_url || "",
  };
}

/** Columns we send to CRM - used by email + /leads table. */
export const CRM_LEAD_FIELDS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "number", label: "Phone" },
  { key: "postcode", label: "Postcode" },
  { key: "description", label: "Description" },
  { key: "vehicle_brand", label: "Brand" },
  { key: "vehicle_model", label: "Model" },
  { key: "vehicle_reg", label: "Reg" },
  { key: "vehicle_vrm", label: "VRM" },
  { key: "vehicle_series", label: "Series" },
  { key: "vehicle_year", label: "Year" },
  { key: "engine_capacity", label: "Engine capacity" },
  { key: "fuel_type", label: "Fuel type" },
  { key: "vehicle_part", label: "Part" },
  { key: "source", label: "Source" },
  { key: "page_url", label: "Page URL" },
];

async function postLeadWebhook(webhookUrl, anonKey, payload, label) {
  if (!anonKey) {
    throw new Error(`${label} anon key is not configured`);
  }
  if (!webhookUrl) {
    throw new Error(`${label} webhook URL is not configured`);
  }

  console.log(`Sending lead to Supabase (${label})...`, webhookUrl);

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  const text = await response.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.error ||
      data?.message ||
      data?.raw ||
      `Lead send failed (${response.status})`;
    console.error(`lead CRM failed (${label})`, message);
    throw new Error(typeof message === "string" ? message : "Lead send failed");
  }

  if (data?.error) {
    console.error(`lead CRM failed (${label})`, data.error.message || data.error);
    throw new Error(data.error.message || "Lead send failed");
  }

  console.log(`lead sent to Supabase (${label}).`);
  return data?.success ?? data;
}

/**
 * Send lead to both Supabase Edge Functions (DB1 + DB2) in parallel.
 * DB1 failure still fails the request (same as before). DB2 errors are logged.
 */
export async function sendLeadToCRM(payload) {
  if (!SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_ANON_KEY is not configured");
  }

  const [db1, db2] = await Promise.allSettled([
    postLeadWebhook(SUPABASE_WEBHOOK_URL, SUPABASE_ANON_KEY, payload, "DB1"),
    SUPABASE_WEBHOOK_URL_2 && SUPABASE_ANON_KEY_2
      ? postLeadWebhook(SUPABASE_WEBHOOK_URL_2, SUPABASE_ANON_KEY_2, payload, "DB2")
      : Promise.resolve({ skipped: true }),
  ]);

  if (db2.status === "rejected") {
    console.error("lead CRM failed (DB2)", db2.reason);
  }

  if (db1.status === "rejected") {
    throw db1.reason instanceof Error ? db1.reason : new Error("Lead send failed");
  }

  return {
    db1: db1.value,
    db2: db2.status === "fulfilled" ? db2.value : { error: db2.reason?.message || "DB2 failed" },
  };
}
