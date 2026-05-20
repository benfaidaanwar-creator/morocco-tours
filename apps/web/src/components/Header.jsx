import { useState, useEffect } from "react";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import useLanguageStore from "../stores/languageStore";
import useTranslation from "../hooks/useTranslation";
import { LANGUAGES } from "../data/translations";

export default function Header() {
  const { t, isRtl } = useTranslation();
  const { lang, setLang } = useLanguageStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const currentLang = LANGUAGES.find((l) => l.code === lang);

  const navLinks = [
    {
      label:
        lang === "ar"
          ? "التجارب"
          : lang === "fr"
            ? "Expériences"
            : lang === "es"
              ? "Experiencias"
              : "Experiences",
      href: "/booking",
    },
    { label: t("nav.gallery"), href: "/gallery" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
        style={{
          background: scrolled ? "rgba(8,7,5,0.97)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(200,169,110,0.12)" : "none",
          backdropFilter: scrolled ? "blur(24px)" : "none",
        }}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <a href="/" className="flex flex-col leading-none group">
              <span className="text-xl md:text-2xl font-playfair-display font-semibold text-white tracking-[0.12em] group-hover:text-[#C8A96E] transition-colors duration-300">
                ERG CHEBBI
              </span>
              <span className="text-[8px] tracking-[0.5em] uppercase text-[#C8A96E] font-inter font-medium mt-1">
                Luxury Desert
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-[11px] text-white/60 hover:text-white tracking-[0.15em] uppercase font-inter font-medium transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C8A96E] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-5">
              {/* Language */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  onBlur={() => setTimeout(() => setLangOpen(false), 150)}
                  className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-[10px] font-inter uppercase tracking-widest"
                >
                  <Globe size={13} />
                  <span>{currentLang?.code.toUpperCase()}</span>
                  <ChevronDown
                    size={11}
                    className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {langOpen && (
                  <div
                    className="absolute top-full mt-3 right-0 w-40 rounded-lg overflow-hidden shadow-2xl"
                    style={{
                      background: "rgba(12,10,7,0.98)",
                      border: "1px solid rgba(200,169,110,0.15)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-inter transition-colors ${lang === l.code ? "text-[#C8A96E]" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Book Now */}
              <a
                href="/booking"
                className="hidden sm:inline-flex items-center px-6 py-2.5 text-[10px] font-semibold tracking-[0.15em] uppercase font-inter transition-all duration-200"
                style={{ background: "#C8A96E", color: "#080705" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#D4B87A")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#C8A96E")
                }
              >
                {t("nav.bookNow")}
              </a>

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-white/70 hover:text-white transition-colors"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60]" dir={isRtl ? "rtl" : "ltr"}>
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute top-0 right-0 h-full w-full max-w-xs flex flex-col"
            style={{ background: "#0C0A07" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 h-24 border-b border-white/5">
              <span className="text-xs font-inter text-white/30 tracking-[0.3em] uppercase">
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 flex flex-col justify-center px-8 gap-0">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-5 text-2xl font-playfair-display font-semibold text-white/80 hover:text-[#C8A96E] transition-colors border-b border-white/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Bottom */}
            <div className="px-8 pb-10 pt-6 border-t border-white/5 space-y-4">
              <div className="flex gap-2 flex-wrap">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-3 py-1.5 text-[10px] font-inter tracking-widest uppercase rounded border transition-colors ${lang === l.code ? "border-[#C8A96E] text-[#C8A96E]" : "border-white/10 text-white/30 hover:border-white/30 hover:text-white/60"}`}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
              <a
                href="/booking"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-4 text-[11px] font-semibold tracking-[0.15em] uppercase font-inter transition-colors"
                style={{ background: "#C8A96E", color: "#080705" }}
              >
                {t("nav.bookNow")}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
