import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import useTranslation from "../../hooks/useTranslation";

export default function FaqPage() {
  const { t, isRtl } = useTranslation();
  const [openIdx, setOpenIdx] = useState(null);
  const items = t("faq.items");
  const itemsArray = Array.isArray(items) ? items : [];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{ background: "#080705" }}>
      <section className="pt-28 pb-24" style={{ background: "#080705" }}>
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#C8A96E]" />
              <span className="text-[9px] text-[#C8A96E] tracking-[0.45em] uppercase font-inter">
                FAQ
              </span>
            </div>
            <h1
              className="font-playfair-display font-semibold text-white tracking-tight mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              {t("faq.title")}
            </h1>
            <p className="text-[15px] text-white/35 font-inter max-w-xl">
              {t("faq.subtitle")}
            </p>
          </div>

          {/* Accordion */}
          <div className="space-y-0">
            {itemsArray.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  style={{ borderBottom: "1px solid rgba(200,169,110,0.08)" }}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="text-[15px] font-inter font-medium text-white/70 group-hover:text-white transition-colors pr-8">
                      {item.q}
                    </span>
                    <div
                      className="shrink-0 w-6 h-6 flex items-center justify-center"
                      style={{ border: "1px solid rgba(200,169,110,0.2)" }}
                    >
                      {isOpen ? (
                        <ChevronUp size={14} className="text-[#C8A96E]" />
                      ) : (
                        <ChevronDown size={14} className="text-white/30" />
                      )}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="pb-6">
                      <p className="text-[14px] text-white/38 font-inter leading-[1.95]">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div
            className="text-center mt-16 pt-10"
            style={{ borderTop: "1px solid rgba(200,169,110,0.08)" }}
          >
            <p className="text-[14px] text-white/30 font-inter mb-6">
              {isRtl
                ? "لم تجد إجابتك؟ تواصل معنا."
                : "Didn't find your answer? Reach out directly."}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-3.5 text-[10px] tracking-[0.15em] uppercase font-inter font-semibold text-[#080705] bg-[#C8A96E] hover:bg-[#D4B87A] transition-colors"
            >
              {t("nav.contact")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
