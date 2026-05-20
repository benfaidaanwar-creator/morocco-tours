import { ArrowRight } from "lucide-react";
import useTranslation from "../../hooks/useTranslation";
import HERO_IMAGES from "../../data/heroImages";

const CAMP_INTERIOR =
  "https://raw.createusercontent.com/d9c07556-a1b5-4a0c-84a9-6e2ef10250f2/";

function MoroccanDivider() {
  return (
    <div className="flex items-center justify-center py-0">
      <svg width="120" height="16" viewBox="0 0 120 16" fill="none">
        <line
          x1="0"
          y1="8"
          x2="45"
          y2="8"
          stroke="#C8A96E"
          strokeWidth="0.4"
          strokeOpacity="0.35"
        />
        <polygon
          points="60,2 65,8 60,14 55,8"
          stroke="#C8A96E"
          strokeWidth="0.6"
          fill="none"
          strokeOpacity="0.5"
        />
        <line
          x1="75"
          y1="8"
          x2="120"
          y2="8"
          stroke="#C8A96E"
          strokeWidth="0.4"
          strokeOpacity="0.35"
        />
      </svg>
    </div>
  );
}

export default function AboutPage() {
  const { t, isRtl } = useTranslation();

  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{ background: "#080705" }}>
      {/* Cinematic hero */}
      <section className="relative h-[65vh] min-h-[480px] overflow-hidden">
        <img
          src={HERO_IMAGES[3].url}
          alt="Erg Chebbi desert"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.45)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,7,5,0.2) 0%, rgba(8,7,5,0.05) 35%, rgba(8,7,5,0.85) 90%, rgba(8,7,5,1) 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-end px-8 sm:px-14 lg:px-20 pb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#C8A96E]" />
              <span className="text-[9px] text-[#C8A96E] tracking-[0.45em] uppercase font-inter">
                {isRtl ? "من نحن" : "Our Story"}
              </span>
            </div>
            <h1
              className="font-playfair-display font-semibold text-white leading-tight mb-4"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}
            >
              {t("about.title")}
            </h1>
            <p className="text-[15px] text-white/45 font-inter leading-relaxed max-w-lg">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 md:py-32" style={{ background: "#080705" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text */}
            <div>
              <div className="flex items-center gap-3 mb-7">
                <div className="h-px w-8 bg-[#C8A96E]" />
                <span className="text-[9px] text-[#C8A96E] tracking-[0.45em] uppercase font-inter">
                  Merzouga · Morocco
                </span>
              </div>
              <div className="space-y-5">
                {[t("about.p1"), t("about.p2"), t("about.p3")].map((p, i) => (
                  <p
                    key={i}
                    className="text-[15px] text-white/42 font-inter leading-[1.95]"
                  >
                    {p}
                  </p>
                ))}
              </div>

              <MoroccanDivider />

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
                {[
                  { num: "15+", label: isRtl ? "سنة خبرة" : "Years" },
                  { num: "10K+", label: isRtl ? "ضيف" : "Guests" },
                  { num: "4.9", label: isRtl ? "تقييم" : "Rating" },
                  { num: "100%", label: isRtl ? "رضا" : "Satisfaction" },
                ].map((s, i) => (
                  <div key={i} className="border-t border-[#C8A96E]/12 pt-5">
                    <p className="text-2xl font-playfair-display font-semibold text-[#C8A96E] mb-1">
                      {s.num}
                    </p>
                    <p className="text-[9px] text-white/25 tracking-[0.3em] uppercase font-inter">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src={CAMP_INTERIOR}
                alt="Inside our luxury camp"
                className="w-full object-cover"
                style={{ aspectRatio: "4/5", filter: "brightness(0.85)" }}
              />
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: "-18px",
                  right: "-18px",
                  width: "100%",
                  height: "100%",
                  border: "1px solid rgba(200,169,110,0.15)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section
        className="py-20 md:py-28"
        style={{
          background: "#0E0B08",
          borderTop: "1px solid rgba(200,169,110,0.06)",
        }}
      >
        <div className="max-w-2xl mx-auto px-6 sm:px-10 text-center">
          <MoroccanDivider />
          <h2
            className="font-playfair-display font-semibold text-white tracking-tight mt-6 mb-6"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)" }}
          >
            {t("about.mission")}
          </h2>
          <p className="text-[15px] text-white/35 font-inter leading-[1.95] mb-12">
            {t("about.missionText")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/booking"
              className="group inline-flex items-center gap-3 px-9 py-4 text-[10px] tracking-[0.15em] uppercase font-inter font-semibold text-[#080705] bg-[#C8A96E] hover:bg-[#D4B87A] transition-colors"
            >
              {t("nav.bookNow")}
              <ArrowRight
                size={12}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-9 py-4 text-[10px] tracking-[0.15em] uppercase font-inter font-medium text-white/35 hover:text-white border border-white/10 hover:border-white/25 transition-all"
            >
              {t("nav.contact")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
