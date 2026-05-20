import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("payment_methods")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    throwIfSupabaseError(error);
    return Response.json(data || []);
  } catch (error) {
    console.error("Payment methods error:", error);
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, method_name, details, is_active, sort_order } = body;

    if (!id) return Response.json({ error: "id required" }, { status: 400 });

    const updates = {};

    if (method_name !== undefined) {
      updates.method_name = method_name;
    }
    if (details !== undefined) {
      updates.details = details;
    }
    if (is_active !== undefined) {
      updates.is_active = is_active;
    }
    if (sort_order !== undefined) {
      updates.sort_order = sort_order;
    }

    if (Object.keys(updates).length === 0)
      return Response.json({ error: "No fields" }, { status: 400 });

    updates.updated_at = new Date().toISOString();
    const { data, error } = await getSupabaseAdmin()
      .from("payment_methods")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    throwIfSupabaseError(error);

    return Response.json(data);
  } catch (error) {
    console.error("Payment method update error:", error);
    return Response.json({ error: "Failed to update" }, { status: 500 });
  }
}
