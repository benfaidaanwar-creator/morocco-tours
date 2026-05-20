import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { data, error } = await getSupabaseAdmin()
      .from("offers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    throwIfSupabaseError(error);
    if (!data) {
      return Response.json({ error: "Offer not found" }, { status: 404 });
    }
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching offer:", error);
    return Response.json({ error: "Failed to fetch offer" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const updates = {};

    const allowedFields = [
      "category",
      "title_en",
      "title_es",
      "title_fr",
      "title_ar",
      "subtitle_en",
      "subtitle_es",
      "subtitle_fr",
      "subtitle_ar",
      "description_en",
      "description_es",
      "description_fr",
      "description_ar",
      "price",
      "currency",
      "duration",
      "included_features_en",
      "included_features_es",
      "included_features_fr",
      "included_features_ar",
      "image_url",
      "is_active",
      "sort_order",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await getSupabaseAdmin()
      .from("offers")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();
    throwIfSupabaseError(error);

    if (!data) {
      return Response.json({ error: "Offer not found" }, { status: 404 });
    }
    return Response.json(data);
  } catch (error) {
    console.error("Error updating offer:", error);
    return Response.json({ error: "Failed to update offer" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { data, error } = await getSupabaseAdmin()
      .from("offers")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    throwIfSupabaseError(error);
    if (!data) {
      return Response.json({ error: "Offer not found" }, { status: 404 });
    }
    return Response.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Error deleting offer:", error);
    return Response.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}
