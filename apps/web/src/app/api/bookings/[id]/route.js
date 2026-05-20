import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { data, error } = await getSupabaseAdmin()
      .from("booking_requests")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    throwIfSupabaseError(error);
    if (!data) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return Response.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { booking_status } = body;

    if (!booking_status) {
      return Response.json({ error: "Status is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: current, error: currentError } = await supabase
      .from("booking_requests")
      .select("booking_status")
      .eq("id", id)
      .maybeSingle();
    throwIfSupabaseError(currentError);
    if (!current) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    const oldStatus = current.booking_status;

    const { data: booking, error: updateError } = await supabase
      .from("booking_requests")
      .update({ booking_status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    throwIfSupabaseError(updateError);

    const { error: historyError } = await supabase
      .from("booking_status_history")
      .insert({ booking_id: id, old_status: oldStatus, new_status: booking_status });
    throwIfSupabaseError(historyError);

    return Response.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return Response.json(
      { error: "Failed to update booking" },
      { status: 500 },
    );
  }
}
