import { useState, useCallback } from "react";
import {
  Send,
  MapPin,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import useTranslation from "../../hooks/useTranslation";

export default function ContactPage() {
  const { t, isRtl } = useTranslation();
  const [form, setForm] = useState({
    sender_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setStatus(null);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to send");
        setStatus("success");
        setForm({
          sender_name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } catch (err) {
        console.error(err);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    },
    [form],
  );

  const inputClass =
    "w-full px-4 py-3 border text-sm font-inter focus:outline-none focus:ring-1 focus:ring-[#C8A96E] placeholder:text-white/20 text-white bg-transparent" +
    " " +
    "border-white/10 hover:border-white/20 transition-colors";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{ background: "#080705" }}>
      {/* Header */}
      <section className="pt-28 pb-16" style={{ background: "#080705" }}>
        <div className="max-w-3xl mx-auto px-6 sm:px-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#C8A96E]" />
            <span className="text-[9px] text-[#C8A96E] tracking-[0.45em] uppercase font-inter">
              {isRtl ? "تواصل معنا" : "Get In Touch"}
            </span>
            <div className="h-px w-8 bg-[#C8A96E]" />
          </div>
          <h1
            className="font-playfair-display font-semibold text-white tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            {t("contact.title")}
          </h1>
          <p className="text-[15px] text-white/35 font-inter max-w-xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24" style={{ background: "#080705" }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] text-white/30 tracking-[0.25em] uppercase mb-2 font-inter">
                      {t("contact.name")} *
                    </label>
                    <input
                      type="text"
                      name="sender_name"
                      value={form.sender_name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/30 tracking-[0.25em] uppercase mb-2 font-inter">
                      {t("contact.email")} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] text-white/30 tracking-[0.25em] uppercase mb-2 font-inter">
                      {t("contact.phone")}
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/30 tracking-[0.25em] uppercase mb-2 font-inter">
                      {t("contact.subject")}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-white/30 tracking-[0.25em] uppercase mb-2 font-inter">
                    {t("contact.message")} *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows="7"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {status === "success" && (
                  <div
                    className="flex items-center gap-2 p-4 text-sm font-inter text-[#C8A96E]"
                    style={{
                      border: "1px solid rgba(200,169,110,0.2)",
                      background: "rgba(200,169,110,0.05)",
                    }}
                  >
                    <CheckCircle size={16} /> {t("contact.success")}
                  </div>
                )}
                {status === "error" && (
                  <div
                    className="flex items-center gap-2 p-4 text-sm font-inter text-red-400"
                    style={{
                      border: "1px solid rgba(239,68,68,0.2)",
                      background: "rgba(239,68,68,0.05)",
                    }}
                  >
                    <AlertCircle size={16} /> {t("contact.error")}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center gap-3 px-9 py-4 text-[10px] tracking-[0.15em] uppercase font-inter font-semibold text-[#080705] bg-[#C8A96E] hover:bg-[#D4B87A] transition-colors disabled:opacity-50"
                >
                  {loading ? t("contact.sending") : t("contact.send")}
                  <Send
                    size={13}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </form>
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-2">
              <div
                className="p-8 space-y-6"
                style={{
                  background: "#0E0B08",
                  border: "1px solid rgba(200,169,110,0.08)",
                }}
              >
                <h3 className="text-[9px] text-[#C8A96E]/60 tracking-[0.4em] uppercase font-inter mb-6">
                  {t("contact.info")}
                </h3>
                {[
                  { Icon: MapPin, text: t("contact.location") },
                  {
                    Icon: Mail,
                    text: "Soufianechahid30@gmail.com",
                    href: "mailto:Soufianechahid30@gmail.com",
                  },
                  {
                    Icon: Phone,
                    text: "+212 691 999 897",
                    href: "tel:+212691999897",
                  },
                  { Icon: Clock, text: t("contact.hours") },
                ].map(({ Icon, text, href }, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 pb-5"
                    style={{ borderBottom: "1px solid rgba(200,169,110,0.06)" }}
                  >
                    <Icon
                      size={15}
                      className="text-[#C8A96E] opacity-60 mt-0.5 shrink-0"
                    />
                    {href ? (
                      <a
                        href={href}
                        className="text-[14px] text-white/35 hover:text-[#C8A96E] font-inter transition-colors"
                      >
                        {text}
                      </a>
                    ) : (
                      <span className="text-[14px] text-white/35 font-inter leading-relaxed">
                        {text}
                      </span>
                    )}
                  </div>
                ))}
                <a
                  href="https://wa.me/212691999897?text=Hello%2C%20I%20would%20like%20to%20book%20a%20desert%20experience."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 w-full text-[10px] tracking-[0.15em] uppercase font-inter font-semibold transition-colors"
                  style={{
                    background: "rgba(37,211,102,0.1)",
                    color: "#25D366",
                    border: "1px solid rgba(37,211,102,0.15)",
                  }}
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
