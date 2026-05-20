import { useState } from "react";
import { Mail, Gift, ArrowRight } from "lucide-react";
import useTranslation from "../hooks/useTranslation";

export default function NewsletterSignup() {
  const { t, isRtl } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1000);
  };

  return (
    <div
      className="rounded-xl border dark:border-white/10 border-gray-200 dark:bg-gradient-to-br dark:from-[#1A1A1A] dark:to-[#0A0A0A] bg-gradient-to-br from-gray-50 to-white p-8 relative overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96E]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C8A96E]/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#C8A96E]/10 flex items-center justify-center">
            <Gift size={24} className="text-[#C8A96E]" />
          </div>
          <div>
            <h3 className="text-xl font-playfair-display font-semibold dark:text-white text-gray-900">
              {isRtl ? "احصل على خصم 10٪" : "Get 10% Off Your First Booking"}
            </h3>
            <p className="text-sm dark:text-white/60 text-gray-600 font-inter">
              {isRtl
                ? "اشترك في نشرتنا الإخبارية"
                : "Subscribe to our newsletter"}
            </p>
          </div>
        </div>

        {status === "success" ? (
          <div className="flex items-center gap-2 py-3 px-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-inter">
            <Mail size={16} />
            <span>{isRtl ? "شكرا للاشتراك!" : "Thanks for subscribing!"}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isRtl ? "بريدك الإلكتروني" : "Your email address"}
              required
              className="flex-1 px-4 py-3 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#C8A96E] focus:border-transparent placeholder:dark:text-white/30 placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="px-6 py-3 bg-[#C8A96E] text-white font-semibold rounded-lg hover:bg-[#B8955E] transition-colors text-sm font-inter disabled:opacity-50 flex items-center gap-2"
            >
              {isRtl ? "اشترك" : "Subscribe"}
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
