import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const updates = {};

    const allowedFields = ["method_name", "details", "is_active", "sort_order"];

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
      .from("payment_methods")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();
    throwIfSupabaseError(error);

    if (!data) {
      return Response.json(
        { error: "Payment method not found" },
        { status: 404 },
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error("Payment update error:", error);
    return Response.json(
      { error: "Failed to update payment method" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { error } = await getSupabaseAdmin().from("payment_methods").delete().eq("id", id);
    throwIfSupabaseError(error);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Payment delete error:", error);
    return Response.json(
      { error: "Failed to delete payment method" },
      { status: 500 },
    );
  }
}
