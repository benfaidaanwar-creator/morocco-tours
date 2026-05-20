import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const offerId = url.searchParams.get("offer_id");
    const month = url.searchParams.get("month");
    const year = url.searchParams.get("year");
    const supabase = getSupabaseAdmin();

    let query = supabase.from("availability").select("*").order("available_date");

    if (offerId) {
      query = query.eq("offer_id", offerId);
    }

    if (month && year) {
      const start = `${year}-${String(month).padStart(2, "0")}-01`;
      const endDate = new Date(Number(year), Number(month), 0).toISOString().slice(0, 10);
      query = query.gte("available_date", start).lte("available_date", endDate);
    }

    const { data, error } = await query;
    throwIfSupabaseError(error);
    return Response.json(data || []);
  } catch (error) {
    console.error("Error fetching availability:", error);
    return Response.json(
      { error: "Failed to fetch availability" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { offer_id, available_date, total_capacity, is_available } = body;

    if (!offer_id || !available_date) {
      return Response.json(
        { error: "offer_id and available_date are required" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: existing, error: existingError } = await supabase
      .from("availability")
      .select("id")
      .eq("offer_id", offer_id)
      .eq("available_date", available_date)
      .maybeSingle();
    throwIfSupabaseError(existingError);

    if (existing) {
      const { data, error } = await supabase
        .from("availability")
        .update({
          total_capacity: total_capacity || 10,
          is_available: is_available !== false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
      throwIfSupabaseError(error);
      return Response.json(data);
    }

    const { data, error } = await supabase
      .from("availability")
      .insert({
        offer_id,
        available_date,
        total_capacity: total_capacity || 10,
        is_available: is_available !== false,
      })
      .select()
      .single();
    throwIfSupabaseError(error);
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("Error managing availability:", error);
    return Response.json(
      { error: "Failed to manage availability" },
      { status: 500 },
    );
  }
}
