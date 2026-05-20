import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin().rpc("get_admin_dashboard_data");
    throwIfSupabaseError(error);
    return Response.json(data);
  } catch (error) {
    console.error("Dashboard error:", error);
    return Response.json(
      { error: "Failed to load dashboard data" },
      { status: 500 },
    );
  }
}
