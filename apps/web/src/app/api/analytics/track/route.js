import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";

export async function POST(request) {
  try {
    const body = await request.json();
    const { page_path, referrer } = body;
    const userAgent = request.headers.get("user-agent") || "";

    const { error } = await getSupabaseAdmin().from("visitor_sessions").insert({
      page_path: page_path || "/",
      referrer: referrer || null,
      user_agent: userAgent,
    });
    throwIfSupabaseError(error);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Tracking error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}
