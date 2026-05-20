import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import useTranslation from "../hooks/useTranslation";
import OfferCard from "./OfferCard";

export default function ServicePage({
  category,
  heroImage,
  titleKey,
  subtitleKey,
  descriptionParts,
}) {
  const { t, isRtl } = useTranslation();

  useEffect(() => {
    try {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_path: `/${category}`,
          referrer: document.referrer,
        }),
      });
    } catch (e) {
      /* silent */
    }
  }, [category]);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["offers", category],
    queryFn: async () => {
      const res = await fetch(`/api/offers?category=${category}`);
      if (!res.ok) throw new Error("Failed to fetch offers");
      return res.json();
    },
  });

  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{ background: "#080705" }}>
      {/* Cinematic Hero */}
      <section className="relative h-[70vh] min-h-[520px] overflow-hidden">
        <img
          src={heroImage}
          alt={t(titleKey)}
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.5)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,7,5,0.25) 0%, rgba(8,7,5,0.05) 30%, rgba(8,7,5,0.8) 85%, rgba(8,7,5,1) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(8,7,5,0.4), transparent 60%)",
          }}
        />

        <div className="absolute inset-0 flex items-end px-8 sm:px-14 lg:px-20 pb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#C8A96E]" />
              <span className="text-[9px] text-[#C8A96E] tracking-[0.45em] uppercase font-inter">
                Erg Chebbi Luxury
              </span>
            </div>
            <h1
              className="font-playfair-display font-semibold text-white leading-tight mb-4"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
            >
              {t(titleKey)}
            </h1>
            <p className="text-[15px] text-white/45 font-inter leading-relaxed max-w-xl">
              {t(subtitleKey)}
            </p>
          </div>
        </div>
      </section>

      {/* Description */}
      {descriptionParts && (
        <section
          className="py-16"
          style={{
            background: "#0E0B08",
            borderBottom: "1px solid rgba(200,169,110,0.06)",
          }}
        >
          <div className="max-w-3xl mx-auto px-6 sm:px-10 text-center">
            {descriptionParts.map((p, i) => (
              <p
                key={i}
                className="text-[15px] text-white/38 font-inter leading-[1.95] mb-4 last:mb-0"
              >
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Offers */}
      <section className="py-20 md:py-28" style={{ background: "#080705" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#C8A96E]" />
              <span className="text-[9px] text-[#C8A96E] tracking-[0.45em] uppercase font-inter">
                {isRtl ? "الباقات" : "Packages"}
              </span>
            </div>
            <h2
              className="font-playfair-display font-semibold text-white"
              style={{ fontSize: "clamp(1.7rem, 3vw, 2.8rem)" }}
            >
              {isRtl ? "اختر تجربتك" : "Choose Your Experience"}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    background: "#0E0B08",
                    border: "1px solid rgba(200,169,110,0.06)",
                  }}
                >
                  <div
                    className="aspect-[16/10]"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  />
                  <div className="p-6 space-y-3">
                    <div
                      className="h-5 w-3/4 rounded-sm"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    />
                    <div
                      className="h-4 w-1/2 rounded-sm"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}

          {!isLoading && offers.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/25 font-inter text-sm tracking-widest uppercase">
                {isRtl ? "لا توجد عروض حالياً" : "No packages available"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section
        className="py-20"
        style={{
          background: "#0E0B08",
          borderTop: "1px solid rgba(200,169,110,0.06)",
        }}
      >
        <div className="max-w-xl mx-auto px-6 sm:px-10 text-center">
          <h2
            className="font-playfair-display font-semibold text-white mb-5"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
          >
            {isRtl ? "هل لديك طلب خاص؟" : "Have a Special Request?"}
          </h2>
          <p className="text-[14px] text-white/30 font-inter leading-[1.9] mb-9">
            {isRtl
              ? "نصمم تجارب مخصصة تماماً لرغباتك. تواصل معنا."
              : "We craft bespoke experiences tailored entirely to your desires. Reach out."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/booking"
              className="group inline-flex items-center gap-3 px-8 py-3.5 text-[10px] tracking-[0.15em] uppercase font-inter font-semibold text-[#080705] bg-[#C8A96E] hover:bg-[#D4B87A] transition-colors"
            >
              {t("nav.bookNow")}
              <ArrowRight
                size={12}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-3.5 text-[10px] tracking-[0.15em] uppercase font-inter font-medium text-white/35 hover:text-white border border-white/10 hover:border-white/25 transition-all"
            >
              {t("nav.contact")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
