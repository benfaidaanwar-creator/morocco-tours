import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";

export async function GET(request) {
  try {
    const { data: settings, error } = await getSupabaseAdmin()
      .from("site_settings")
      .select("*")
      .like("setting_key", "image_%");
    throwIfSupabaseError(error);

    const images = {};
    (settings || []).forEach((row) => {
      images[row.setting_key] = row.setting_value;
    });

    return Response.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return Response.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    for (const [key, value] of Object.entries(body)) {
      if (key.startsWith("image_")) {
        const { error } = await getSupabaseAdmin().from("site_settings").upsert(
          {
            setting_key: key,
            setting_value: value,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "setting_key" },
        );
        throwIfSupabaseError(error);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating images:", error);
    return Response.json({ error: "Failed to update images" }, { status: 500 });
  }
}
