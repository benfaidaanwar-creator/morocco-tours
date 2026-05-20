import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const activeOnly = url.searchParams.get("active") !== "false";
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("gallery_assets")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (activeOnly) query = query.eq("is_active", true);
    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    throwIfSupabaseError(error);
    return Response.json(data || []);
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return Response.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { image_url, category, caption, sort_order } = body;

    if (!image_url) {
      return Response.json({ error: "image_url is required" }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("gallery_assets")
      .insert({
        image_url,
        category: category || null,
        caption: caption || null,
        sort_order: sort_order || 0,
      })
      .select()
      .single();
    throwIfSupabaseError(error);
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("Gallery create error:", error);
    return Response.json(
      { error: "Failed to add to gallery" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return Response.json({ error: "id required" }, { status: 400 });

    const { error } = await getSupabaseAdmin().from("gallery_assets").delete().eq("id", id);
    throwIfSupabaseError(error);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }
}
