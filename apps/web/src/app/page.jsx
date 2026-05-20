import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Star } from "lucide-react";
import useTranslation from "../hooks/useTranslation";
import HERO_IMAGES from "../data/heroImages";

// ─── Moroccan geometric divider ───────────────────────────────────────────────
function MoroccanDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <svg width="160" height="20" viewBox="0 0 160 20" fill="none">
        <line
          x1="0"
          y1="10"
          x2="60"
          y2="10"
          stroke="#C8A96E"
          strokeWidth="0.5"
          strokeOpacity="0.4"
        />
        <polygon
          points="80,2 87,10 80,18 73,10"
          stroke="#C8A96E"
          strokeWidth="0.7"
          fill="none"
          strokeOpacity="0.6"
        />
        <circle cx="80" cy="10" r="2.5" fill="#C8A96E" fillOpacity="0.6" />
        <line
          x1="100"
          y1="10"
          x2="160"
          y2="10"
          stroke="#C8A96E"
          strokeWidth="0.5"
          strokeOpacity="0.4"
        />
      </svg>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const { t, isRtl } = useTranslation();
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <img
            src={HERO_IMAGES[current].url}
            alt={HERO_IMAGES[current].alt}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,7,5,0.3) 0%, rgba(8,7,5,0.05) 35%, rgba(8,7,5,0.55) 70%, rgba(8,7,5,0.93) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(8,7,5,0.45) 0%, transparent 55%)",
        }}
      />

      {/* Bottom-left content */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl"
        >
          {/* Location tag */}
          <div className="flex items-center gap-3 mb-7">
            <div className="h-px w-10 bg-[#C8A96E]" />
            <span className="text-[10px] text-[#C8A96E] tracking-[0.45em] uppercase font-inter font-medium">
              Merzouga · Morocco
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-playfair-display font-semibold text-white leading-[1.05] tracking-tight mb-7"
            style={{ fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)" }}
          >
            {t("hero.headline")}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/55 font-inter leading-relaxed mb-10 max-w-lg">
            {t("hero.subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="/booking"
              className="group inline-flex items-center gap-3 px-9 py-4 text-[10px] tracking-[0.18em] uppercase font-inter font-semibold text-[#080705] bg-[#C8A96E] hover:bg-[#D4B87A] transition-colors duration-200"
            >
              {t("hero.cta")}
              <ArrowRight
                size={13}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="/gallery"
              className="inline-flex items-center gap-3 text-[10px] tracking-[0.18em] uppercase font-inter font-medium text-white/50 hover:text-[#C8A96E] transition-colors"
            >
              <span className="w-6 h-px bg-current" />
              {t("hero.ctaSecondary")}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Slide numbers — right side */}
      <div className="absolute right-8 sm:right-12 bottom-24 flex flex-col items-center gap-4 z-10">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className="flex items-center gap-2 group"
            aria-label={`Slide ${idx + 1}`}
          >
            <span
              className={`text-[9px] font-inter transition-all duration-300 ${idx === current ? "text-[#C8A96E]" : "text-white/20"}`}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>
            <div
              className={`h-px bg-[#C8A96E] transition-all duration-500 ${idx === current ? "w-8 opacity-100" : "w-2 opacity-20"}`}
            />
          </button>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 z-10">
        <span className="text-[8px] text-white tracking-[0.4em] uppercase font-inter">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}

// ─── EXPERIENCES ──────────────────────────────────────────────────────────────
const EXPERIENCES = [
  { key: "camp", href: "/camp", image: HERO_IMAGES[0].url, num: "01" },
  { key: "camel", href: "/camel-tours", image: HERO_IMAGES[1].url, num: "02" },
  { key: "quad", href: "/quad-atv", image: HERO_IMAGES[2].url, num: "03" },
  { key: "transfer", href: "/transfers", image: HERO_IMAGES[3].url, num: "04" },
];

function ExperiencesSection() {
  const { t, isRtl } = useTranslation();
  const [hovered, setHovered] = useState(null);

  return (
    <section
      className="py-28 md:py-36"
      style={{ background: "#080705" }}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#C8A96E]" />
              <span className="text-[9px] text-[#C8A96E] tracking-[0.45em] uppercase font-inter">
                {isRtl ? "تجاربنا" : "Our Experiences"}
              </span>
            </div>
            <h2
              className="font-playfair-display font-semibold text-white leading-tight"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)" }}
            >
              {t("services.title")}
            </h2>
          </div>
          <a
            href="/booking"
            className="group flex items-center gap-3 text-[10px] text-[#C8A96E] tracking-[0.2em] uppercase font-inter font-medium hover:gap-4 transition-all"
          >
            {isRtl ? "احجز الآن" : "Book an Experience"}
            <ArrowRight
              size={13}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </div>

        {/* Grid — asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {EXPERIENCES.map((exp, idx) => (
            <a
              key={exp.key}
              href={exp.href}
              className="relative overflow-hidden block group"
              style={{ aspectRatio: idx === 0 ? "16/9" : "4/3" }}
              onMouseEnter={() => setHovered(exp.key)}
              onMouseLeave={() => setHovered(null)}
            >
              <img
                src={exp.image}
                alt={t(`services.${exp.key}`)}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              {/* Gradient */}
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  background:
                    "linear-gradient(to top, rgba(8,7,5,0.88) 0%, rgba(8,7,5,0.1) 55%, transparent 100%)",
                }}
              />

              {/* Hover tint */}
              <div
                className={`absolute inset-0 bg-[#080705]/40 transition-opacity duration-500 ${hovered === exp.key ? "opacity-100" : "opacity-0"}`}
              />

              {/* Content */}
              <div className="absolute inset-0 p-7 sm:p-9 flex flex-col justify-between">
                <span className="text-[9px] text-[#C8A96E]/50 tracking-[0.3em] font-inter">
                  {exp.num}
                </span>
                <div>
                  <h3
                    className="font-playfair-display font-semibold text-white mb-2 group-hover:text-[#C8A96E] transition-colors duration-300"
                    style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)" }}
                  >
                    {t(`services.${exp.key}`)}
                  </h3>
                  <p className="text-sm text-white/45 font-inter leading-relaxed max-w-xs line-clamp-2 mb-4">
                    {t(`services.${exp.key}Desc`)}
                  </p>
                  <div
                    className={`flex items-center gap-2 text-[#C8A96E] transition-all duration-400 ${hovered === exp.key ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
                  >
                    <span className="text-[9px] tracking-[0.25em] uppercase font-inter font-semibold">
                      {isRtl ? "اكتشف" : "Discover"}
                    </span>
                    <ArrowRight size={11} />
                  </div>
                </div>
              </div>

              {/* Gold corner accents */}
              <div
                className={`absolute top-0 left-0 w-10 h-px bg-[#C8A96E] transition-opacity duration-400 ${hovered === exp.key ? "opacity-100" : "opacity-0"}`}
              />
              <div
                className={`absolute top-0 left-0 h-10 w-px bg-[#C8A96E] transition-opacity duration-400 ${hovered === exp.key ? "opacity-100" : "opacity-0"}`}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function AboutSection() {
  const { isRtl } = useTranslation();

  return (
    <section
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: "#0E0B08" }}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Subtle Moroccan pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C8A96E'%3E%3Cpolygon points='40,0 80,20 80,60 40,80 0,60 0,20'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image with frame */}
          <div className="relative">
            <img
              src={HERO_IMAGES[0].url}
              alt="Luxury desert camp"
              className="w-full object-cover"
              style={{ aspectRatio: "3/4", filter: "brightness(0.82)" }}
            />
            {/* Offset gold border */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: "-20px",
                right: "-20px",
                width: "100%",
                height: "100%",
                border: "1px solid rgba(200,169,110,0.18)",
              }}
            />
            {/* Floating stat */}
            <div
              className="absolute bottom-10 left-8 px-6 py-4"
              style={{
                background: "rgba(8,7,5,0.95)",
                border: "1px solid rgba(200,169,110,0.18)",
              }}
            >
              <p className="text-2xl font-playfair-display font-semibold text-[#C8A96E]">
                10,000+
              </p>
              <p className="text-[9px] text-white/40 tracking-[0.3em] uppercase font-inter mt-1">
                {isRtl ? "ضيف سعيد" : "Happy Guests"}
              </p>
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="flex items-center gap-3 mb-7">
              <div className="h-px w-8 bg-[#C8A96E]" />
              <span className="text-[9px] text-[#C8A96E] tracking-[0.45em] uppercase font-inter">
                {isRtl ? "قصتنا" : "Our Story"}
              </span>
            </div>

            <h2
              className="font-playfair-display font-semibold text-white leading-tight mb-8"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
            >
              {isRtl
                ? "حيث تلتقي الفخامة بروح الصحراء"
                : "Where Luxury Meets the Soul of the Desert"}
            </h2>

            <p className="text-[15px] text-white/45 font-inter leading-[1.9] mb-5">
              {isRtl
                ? "نحن نقدم تجارب فاخرة حقيقية في قلب عرق الشبي، حيث تلتقي الضيافة البربرية الأصيلة بكل عناصر الرفاهية الحديثة."
                : "We create genuinely immersive luxury experiences in the heart of Erg Chebbi, where authentic Berber hospitality meets every element of modern comfort."}
            </p>

            <p className="text-[15px] text-white/35 font-inter leading-[1.9] mb-12">
              {isRtl
                ? "من خيام الفاخرة تحت سماء مرصعة بالنجوم إلى رحلات الإبل في ساعة الذهب، كل لحظة مصممة بعناية لتصبح ذكرى لا تُنسى."
                : "From luxury canvas tents beneath star-draped skies to camel treks at golden hour — every moment is crafted to become an unforgettable memory."}
            </p>

            <MoroccanDivider />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-10">
              {[
                { num: "15+", label: isRtl ? "سنوات" : "Years" },
                { num: "4.9★", label: isRtl ? "تقييم" : "Rating" },
                { num: "100%", label: isRtl ? "ضمان" : "Guarantee" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border-t border-[#C8A96E]/15 pt-5"
                >
                  <p className="text-2xl font-playfair-display font-semibold text-[#C8A96E] mb-1">
                    {stat.num}
                  </p>
                  <p className="text-[9px] text-white/25 tracking-[0.3em] uppercase font-inter">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="/about"
              className="group inline-flex items-center gap-3 mt-10 text-[10px] tracking-[0.2em] uppercase font-inter font-medium text-white/50 hover:text-[#C8A96E] transition-colors"
            >
              {isRtl ? "اعرف أكثر" : "Learn More"}
              <ArrowRight
                size={12}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIAL ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    country: "United Kingdom",
    rating: 5,
    text: "An experience beyond words. The luxury camp, the stars, the silence of the desert — it changed how I see the world.",
  },
  {
    name: "Marco Rossi",
    country: "Italy",
    rating: 5,
    text: "Impeccably organized from start to finish. The team made us feel like royalty in the middle of the Sahara.",
  },
  {
    name: "Emma Schmidt",
    country: "Germany",
    rating: 5,
    text: "Waking up in a luxury tent to the sunrise over Erg Chebbi dunes is something I will never forget.",
  },
];

function TestimonialsSection() {
  const { isRtl } = useTranslation();
  const [idx, setIdx] = useState(0);
  const review = TESTIMONIALS[idx];

  useEffect(() => {
    const timer = setInterval(
      () => setIdx((p) => (p + 1) % TESTIMONIALS.length),
      6000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative py-28 md:py-40 overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Full-screen blurred background */}
      <img
        src={HERO_IMAGES[1].url}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.15) saturate(0.6)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "rgba(8,7,5,0.82)" }}
      />

      {/* Moroccan hex pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C8A96E' stroke-width='0.8'%3E%3Cpolygon points='30,3 55,17 55,43 30,57 5,43 5,17'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 sm:px-10 text-center">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-10 bg-[#C8A96E]/40" />
          <span className="text-[9px] text-[#C8A96E] tracking-[0.45em] uppercase font-inter">
            {isRtl ? "شهادات ضيوفنا" : "Guest Stories"}
          </span>
          <div className="h-px w-10 bg-[#C8A96E]/40" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Stars */}
            <div className="flex items-center justify-center gap-1.5 mb-9">
              {[...Array(review.rating)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill="#C8A96E"
                  className="text-[#C8A96E]"
                />
              ))}
            </div>

            <blockquote
              className="font-playfair-display text-white/90 leading-relaxed italic mb-10"
              style={{ fontSize: "clamp(1.15rem, 2.5vw, 1.75rem)" }}
            >
              "{review.text}"
            </blockquote>

            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-semibold text-white font-inter tracking-wide">
                {review.name}
              </p>
              <p className="text-[9px] text-white/30 tracking-[0.3em] uppercase font-inter">
                {review.country}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 mt-12">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-px transition-all duration-400 ${i === idx ? "w-10 bg-[#C8A96E]" : "w-3 bg-white/20 hover:bg-white/40"}`}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CtaSection() {
  const { t, isRtl } = useTranslation();

  return (
    <section
      className="relative py-28 md:py-44 overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <img
        src={HERO_IMAGES[3].url}
        alt="Desert"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.35)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(8,7,5,0.88) 0%, rgba(8,7,5,0.4) 100%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 sm:px-10 text-center">
        <MoroccanDivider />
        <h2
          className="font-playfair-display font-semibold text-white leading-tight mt-8 mb-6"
          style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}
        >
          {isRtl ? "ابدأ رحلتك الصحراوية" : "Begin Your Desert Journey"}
        </h2>
        <p className="text-[15px] text-white/45 font-inter leading-[1.85] mb-11 max-w-lg mx-auto">
          {isRtl
            ? "احجز تجربتك الفاخرة اليوم. دعنا نصنع شيئاً استثنائياً لك."
            : "Reserve your luxury desert experience today. Let us craft something extraordinary for you."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/booking"
            className="group inline-flex items-center gap-3 px-10 py-4 text-[10px] tracking-[0.18em] uppercase font-inter font-semibold text-[#080705] bg-[#C8A96E] hover:bg-[#D4B87A] transition-colors duration-200"
          >
            {t("nav.bookNow")}
            <ArrowRight
              size={13}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
          <a
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-4 text-[10px] tracking-[0.18em] uppercase font-inter font-medium text-white/50 hover:text-white border border-white/10 hover:border-white/30 transition-all"
          >
            {t("nav.contact")}
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ExperiencesSection />
      <AboutSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
