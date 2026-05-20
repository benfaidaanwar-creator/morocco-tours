import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";

export async function GET() {
  try {
    const { data: rows, error } = await getSupabaseAdmin()
      .from("site_settings")
      .select("setting_key, setting_value");
    throwIfSupabaseError(error);
    const settings = {};
    for (const row of rows || []) {
      settings[row.setting_key] = row.setting_value;
    }
    return Response.json(settings);
  } catch (error) {
    console.error("Settings fetch error:", error);
    return Response.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const updates = Object.entries(body);
    const supabase = getSupabaseAdmin();

    for (const [key, value] of updates) {
      const { error } = await supabase.from("site_settings").upsert(
        {
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "setting_key" },
      );
      throwIfSupabaseError(error);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Settings update error:", error);
    return Response.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
