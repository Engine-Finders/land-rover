import { Resend } from "resend";
import { LEAD_SOURCE } from "@/app/api/lead/constants";
import { CRM_LEAD_FIELDS } from "@/app/api/lead/crm";

// Hardcoded email settings (API key only comes from env)
const TO_EMAIL = "ef2crm@gmail.com";
const FROM_EMAIL = "LandRoverEngine.uk <noreply@landroverengine.uk>";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label, value) {
  const display = value === undefined || value === null || String(value).trim() === "" ? "-" : String(value);
  return `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#64748b;font-size:13px;width:38%;">${escapeHtml(label)}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(display)}</td>
  </tr>`;
}

function buildCalculatorSection(calculator) {
  if (!calculator || typeof calculator !== "object") return "";

  return `
          <h2 style="margin:20px 0 10px;font-size:15px;color:#175f46;text-transform:uppercase;letter-spacing:0.04em;">Diagnostic Calculator</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;">
            ${row("Category", calculator.category)}
            ${row("Diagnosis", calculator.diagnosis)}
            ${row("Severity", calculator.severity)}
            ${row("Evidence", calculator.evidence)}
            ${row("Engine codes", calculator.engineCodes)}
            ${row("Vehicle age", calculator.vehicleAge)}
            ${row("Car value", calculator.carValue)}
            ${row("Engine route", calculator.engineRoute)}
            ${row("Repair cost", calculator.repairCost)}
            ${row("Replacement cost", calculator.replacementCost)}
            ${row("Dealer estimate", calculator.dealerEstimate)}
            ${row("Replacement vs value", calculator.replacementVsValue)}
            ${row("Repair vs value", calculator.repairVsValue)}
            ${row("Verdict", calculator.verdict)}
          </table>`;
}

function buildLeadEmailHtml(payload = {}) {
  const fieldRows = CRM_LEAD_FIELDS.map((field) => row(field.label, payload[field.key])).join("");

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="padding:20px 24px;background:#175f46;color:#ffffff;">
          <h1 style="margin:0;font-size:20px;">New quote request</h1>
          <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">Lead from ${escapeHtml(payload.source || LEAD_SOURCE)}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <h2 style="margin:0 0 10px;font-size:15px;color:#175f46;text-transform:uppercase;letter-spacing:0.04em;">Lead fields</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;margin-bottom:20px;">
            ${fieldRows}
          </table>
          ${buildCalculatorSection(payload.calculator)}
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Notify ops inbox about a new lead.
 * Does not email the customer.
 */
export async function sendLeadEmail(payload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const customerEmail = String(payload?.email || "").trim();
  const resend = new Resend(apiKey);
  const vrm = payload?.vehicle_vrm || payload?.vehicle_reg || "unknown";
  const fromCalc = payload?.calculator ? " · calculator" : "";
  const subject = `New quote · ${payload?.name || "Lead"} · ${String(vrm).toUpperCase()}${fromCalc} · ${LEAD_SOURCE}`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    ...(customerEmail ? { replyTo: customerEmail } : {}),
    subject,
    html: buildLeadEmailHtml(payload),
  });

  if (error) {
    console.error("lead email failed", error);
    throw new Error(error.message || "Failed to send lead email");
  }

  console.log("lead email sent to", TO_EMAIL, data?.id || "");
  return data;
}
