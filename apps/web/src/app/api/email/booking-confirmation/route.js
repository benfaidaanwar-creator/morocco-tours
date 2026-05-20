import { sendEmail } from "@/app/api/utils/send-email";

const OWNER_EMAIL =
  process.env.OWNER_NOTIFICATION_EMAIL || "Soufianechahid30@gmail.com";
const FROM_EMAIL = process.env.BOOKING_FROM_EMAIL || "onboarding@resend.dev";

function buildCustomerEmail(booking) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;font-family:'Inter',-apple-system,sans-serif;background:#F9FAFB;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:24px;color:#C8A96E;margin:0;letter-spacing:0.08em;">ERG CHEBBI</h1>
          <p style="font-size:10px;color:#C8A96E;letter-spacing:0.35em;text-transform:uppercase;margin:4px 0 0;">LUXURY</p>
        </div>
        <div style="background:white;border-radius:12px;border:1px solid #E5E7EB;padding:32px;">
          <h2 style="font-size:20px;color:#111827;margin:0 0 8px;">Booking Confirmed</h2>
          <p style="font-size:14px;color:#6B7280;margin:0 0 24px;">Thank you for choosing Erg Chebbi Luxury. Here are your booking details:</p>
          
          <div style="border-top:1px solid #E5E7EB;padding-top:16px;">
            <table style="width:100%;font-size:14px;color:#374151;">
              <tr><td style="padding:8px 0;color:#6B7280;">Name</td><td style="padding:8px 0;text-align:right;font-weight:600;">${booking.full_name}</td></tr>
              <tr><td style="padding:8px 0;color:#6B7280;">Experience</td><td style="padding:8px 0;text-align:right;font-weight:600;">${booking.offer_title || booking.category || "N/A"}</td></tr>
              ${booking.check_in ? `<tr><td style="padding:8px 0;color:#6B7280;">Check-in</td><td style="padding:8px 0;text-align:right;">${booking.check_in}</td></tr>` : ""}
              ${booking.check_out ? `<tr><td style="padding:8px 0;color:#6B7280;">Check-out</td><td style="padding:8px 0;text-align:right;">${booking.check_out}</td></tr>` : ""}
              ${booking.activity_date ? `<tr><td style="padding:8px 0;color:#6B7280;">Date</td><td style="padding:8px 0;text-align:right;">${booking.activity_date}</td></tr>` : ""}
              <tr><td style="padding:8px 0;color:#6B7280;">Guests</td><td style="padding:8px 0;text-align:right;">${booking.adults} adults${booking.children > 0 ? `, ${booking.children} children` : ""}</td></tr>
              <tr><td style="padding:8px 0;color:#6B7280;">Payment</td><td style="padding:8px 0;text-align:right;">${booking.payment_method || "N/A"}</td></tr>
            </table>
          </div>

          <div style="background:#F9FAFB;border-radius:8px;padding:16px;margin-top:16px;text-align:center;">
            <p style="font-size:12px;color:#6B7280;margin:0 0 4px;">Estimated Total</p>
            <p style="font-size:28px;font-weight:700;color:#C8A96E;margin:0;">€${booking.estimated_total || 0}</p>
          </div>

          <p style="font-size:13px;color:#6B7280;margin:24px 0 0;line-height:1.6;">
            Our team will contact you shortly to confirm the final details. If you have any questions, feel free to reach us at <a href="mailto:Soufianechahid30@gmail.com" style="color:#C8A96E;">Soufianechahid30@gmail.com</a> or WhatsApp <a href="https://wa.me/212691999897" style="color:#C8A96E;">+212 691 999 897</a>.
          </p>
        </div>
        <p style="text-align:center;font-size:11px;color:#9CA3AF;margin-top:24px;">© ${new Date().getFullYear()} Erg Chebbi Luxury · Merzouga, Morocco</p>
      </div>
    </body>
    </html>
  `;
}

function buildOwnerEmail(booking) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;font-family:'Inter',-apple-system,sans-serif;background:#0A0A0A;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="background:#1A1A1A;border-radius:12px;border:1px solid rgba(255,255,255,0.1);padding:32px;">
          <h2 style="font-size:20px;color:#C8A96E;margin:0 0 8px;">🔔 New Booking Received</h2>
          <p style="font-size:14px;color:rgba(255,255,255,0.5);margin:0 0 24px;">A new booking has been submitted on your website.</p>
          
          <table style="width:100%;font-size:14px;color:rgba(255,255,255,0.7);">
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);">Guest Name</td><td style="padding:8px 0;text-align:right;color:white;font-weight:600;">${booking.full_name}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);">Email</td><td style="padding:8px 0;text-align:right;"><a href="mailto:${booking.email}" style="color:#C8A96E;">${booking.email}</a></td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);">Phone</td><td style="padding:8px 0;text-align:right;">${booking.phone || "Not provided"}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);">Country</td><td style="padding:8px 0;text-align:right;">${booking.country || "Not specified"}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);">Experience</td><td style="padding:8px 0;text-align:right;color:#C8A96E;font-weight:600;">${booking.offer_title || booking.category || "N/A"}</td></tr>
            ${booking.check_in ? `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);">Check-in</td><td style="padding:8px 0;text-align:right;">${booking.check_in}</td></tr>` : ""}
            ${booking.check_out ? `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);">Check-out</td><td style="padding:8px 0;text-align:right;">${booking.check_out}</td></tr>` : ""}
            ${booking.activity_date ? `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);">Activity Date</td><td style="padding:8px 0;text-align:right;">${booking.activity_date}</td></tr>` : ""}
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);">Guests</td><td style="padding:8px 0;text-align:right;">${booking.adults} adults, ${booking.children || 0} children</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);">Payment</td><td style="padding:8px 0;text-align:right;">${booking.payment_method || "N/A"}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);">Total</td><td style="padding:8px 0;text-align:right;color:#C8A96E;font-size:20px;font-weight:700;">€${booking.estimated_total || 0}</td></tr>
          </table>

          ${booking.special_requests ? `<div style="margin-top:16px;padding:12px;background:rgba(255,255,255,0.05);border-radius:8px;"><p style="font-size:12px;color:rgba(255,255,255,0.4);margin:0 0 4px;">Special Requests</p><p style="font-size:14px;color:rgba(255,255,255,0.7);margin:0;">${booking.special_requests}</p></div>` : ""}

          <div style="margin-top:24px;text-align:center;">
            <a href="${process.env.NEXT_PUBLIC_CREATE_APP_URL || ""}/admin/dashboard" style="display:inline-block;padding:12px 24px;background:#C8A96E;color:white;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;">View in Dashboard</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request) {
  try {
    const booking = await request.json();

    const results = { customer: null, owner: null, errors: [] };

    try {
      const customerResult = await sendEmail({
        to: booking.email,
        from: FROM_EMAIL,
        subject: `Booking Confirmation — Erg Chebbi Luxury`,
        html: buildCustomerEmail(booking),
      });
      results.customer = customerResult;
    } catch (err) {
      console.error("Customer email error:", err);
      results.errors.push("Failed to send customer email: " + err.message);
    }

    try {
      const ownerResult = await sendEmail({
        to: OWNER_EMAIL,
        from: FROM_EMAIL,
        subject: `🔔 New Booking: ${booking.full_name} — ${booking.offer_title || booking.category}`,
        html: buildOwnerEmail(booking),
      });
      results.owner = ownerResult;
    } catch (err) {
      console.error("Owner email error:", err);
      results.errors.push("Failed to send owner notification: " + err.message);
    }

    return Response.json(results);
  } catch (error) {
    console.error("Email endpoint error:", error);
    return Response.json(
      {
        error: "Email sending failed. Make sure RESEND_API_KEY is configured.",
      },
      { status: 500 },
    );
  }
}
