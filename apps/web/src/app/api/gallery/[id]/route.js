import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { error } = await getSupabaseAdmin().from("gallery_assets").delete().eq("id", id);
    throwIfSupabaseError(error);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return Response.json(
      { error: "Failed to delete gallery item" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const updates = {};

    const allowedFields = [
      "image_url",
      "category",
      "caption",
      "sort_order",
      "is_active",
    ];

    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    updates.updated_at = new Date().toISOString();
    const { data, error } = await getSupabaseAdmin()
      .from("gallery_assets")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();
    throwIfSupabaseError(error);

    if (!data) {
      return Response.json(
        { error: "Gallery item not found" },
        { status: 404 },
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error("Gallery update error:", error);
    return Response.json(
      { error: "Failed to update gallery item" },
      { status: 500 },
    );
  }
}
