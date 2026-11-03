import { LEAD_SOURCE, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/app/api/lead/constants";

/**
 * GET /api/leads - list leads for this website only (source = landroverengines.uk).
 */
export async function GET() {
  try {
    if (!SUPABASE_ANON_KEY) {
      return Response.json({ error: "SUPABASE_ANON_KEY is not configured" }, { status: 500 });
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
        data?.message ||
        data?.error ||
        data?.hint ||
        text ||
        `Failed to fetch leads (${response.status})`;
      console.error("fetch leads failed", message);
      return Response.json(
        { error: typeof message === "string" ? message : "Failed to fetch leads" },
        { status: response.status },
      );
    }

    return Response.json({
      success: true,
      source: LEAD_SOURCE,
      count: Array.isArray(data) ? data.length : 0,
      leads: Array.isArray(data) ? data : [],
    });
  } catch (error) {
    console.error("fetch leads failed", error);
    return Response.json(
      { error: error.message || "Failed to fetch leads" },
      { status: 500 },
    );
  }
}
