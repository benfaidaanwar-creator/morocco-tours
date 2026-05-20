import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    throwIfSupabaseError(error);
    return Response.json(data || []);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return Response.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sender_name, email, phone, subject, message } = body;

    if (!sender_name || !email || !message) {
      return Response.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    const { data, error } = await getSupabaseAdmin()
      .from("contact_messages")
      .insert({
        sender_name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      })
      .select()
      .single();
    throwIfSupabaseError(error);

    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
