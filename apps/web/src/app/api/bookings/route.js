import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("booking_requests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("booking_status", status);
    }

    const { data, error, count } = await query;
    throwIfSupabaseError(error);

    return Response.json({
      bookings: data || [],
      total: count || 0,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return Response.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      offer_id,
      full_name,
      email,
      phone,
      country,
      preferred_language,
      category,
      offer_title,
      check_in,
      check_out,
      activity_date,
      adults,
      children,
      special_requests,
      payment_method,
      estimated_total,
    } = body;

    if (!full_name || !email) {
      return Response.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: booking, error: bookingError } = await supabase
      .from("booking_requests")
      .insert({
        offer_id: offer_id || null,
        full_name,
        email,
        phone: phone || null,
        country: country || null,
        preferred_language: preferred_language || "en",
        category: category || null,
        offer_title: offer_title || null,
        check_in: check_in || null,
        check_out: check_out || null,
        activity_date: activity_date || null,
        adults: adults || 1,
        children: children || 0,
        special_requests: special_requests || null,
        payment_method: payment_method || null,
        estimated_total: estimated_total || null,
        booking_status: "new",
      })
      .select()
      .single();
    throwIfSupabaseError(bookingError);

    const { error: historyError } = await supabase
      .from("booking_status_history")
      .insert({ booking_id: booking.id, old_status: null, new_status: "new" });
    throwIfSupabaseError(historyError);

    if (check_in && offer_id) {
      const { error: availabilityError } = await supabase.rpc(
        "increment_availability_booking",
        { p_offer_id: offer_id, p_available_date: check_in },
      );
      throwIfSupabaseError(availabilityError);
    }

    if (activity_date && offer_id) {
      const { error: availabilityError } = await supabase.rpc(
        "increment_availability_booking",
        { p_offer_id: offer_id, p_available_date: activity_date },
      );
      throwIfSupabaseError(availabilityError);
    }

    // Send confirmation emails (non-blocking)
    try {
      fetch(
        `${process.env.NEXT_PUBLIC_CREATE_APP_URL || ""}/api/email/booking-confirmation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(booking),
        },
      ).catch((err) => console.error("Email trigger error:", err));
    } catch (emailErr) {
      console.error("Email trigger failed:", emailErr);
    }

    return Response.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return Response.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
