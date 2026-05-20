import { MapPin, Mail, Phone } from "lucide-react";
import useTranslation from "../hooks/useTranslation";
import useLanguageStore from "../stores/languageStore";

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/positano_store1",
    label: "IG",
  },
  { name: "TikTok", url: "https://www.tiktok.com/@soufiane_ft10", label: "TT" },
  {
    name: "Facebook",
    url: "https://www.facebook.com/share/18MJ4h2CHG/",
    label: "FB",
  },
  { name: "WhatsApp", url: "https://wa.me/212691999897", label: "WA" },
];

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
          strokeOpacity="0.3"
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
          strokeOpacity="0.3"
        />
      </svg>
    </div>
  );
}

export default function Footer() {
  const { t, isRtl } = useTranslation();
  const { lang } = useLanguageStore();

  const experienceLinks = [
    { label: t("nav.luxuryCamp"), href: "/camp" },
    { label: t("nav.camelTours"), href: "/camel-tours" },
    { label: t("nav.quadAtv"), href: "/quad-atv" },
    { label: t("nav.transfers"), href: "/transfers" },
  ];

  const companyLinks = [
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.gallery"), href: "/gallery" },
    { label: t("nav.faq"), href: "/faq" },
    { label: t("nav.contact"), href: "/contact" },
    { label: t("nav.bookNow"), href: "/booking" },
  ];

  return (
    <footer
      dir={isRtl ? "rtl" : "ltr"}
      style={{
        background: "#0C0A07",
        borderTop: "1px solid rgba(200,169,110,0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-20 pb-10">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="/" className="flex flex-col leading-none mb-8">
              <span className="text-xl font-playfair-display font-semibold text-white tracking-[0.12em]">
                ERG CHEBBI
              </span>
              <span className="text-[8px] tracking-[0.5em] uppercase text-[#C8A96E] font-inter font-medium mt-1">
                Luxury Desert
              </span>
            </a>
            <p className="text-[13px] text-white/30 font-inter leading-[1.9] mb-8 max-w-[220px]">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-white/25 hover:text-[#C8A96E] tracking-widest font-inter uppercase transition-colors"
                  aria-label={s.name}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Experiences */}
          <div>
            <h4 className="text-[9px] font-inter font-semibold text-white/25 tracking-[0.4em] uppercase mb-6">
              {t("footer.experiences")}
            </h4>
            <ul className="space-y-3.5">
              {experienceLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[13px] text-white/45 hover:text-[#C8A96E] transition-colors font-inter"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[9px] font-inter font-semibold text-white/25 tracking-[0.4em] uppercase mb-6">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-3.5">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[13px] text-white/45 hover:text-[#C8A96E] transition-colors font-inter"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[9px] font-inter font-semibold text-white/25 tracking-[0.4em] uppercase mb-6">
              {t("contact.info")}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin
                  size={13}
                  className="text-[#C8A96E] mt-0.5 shrink-0 opacity-70"
                />
                <span className="text-[13px] text-white/35 font-inter leading-relaxed">
                  {t("contact.location")}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Phone
                  size={13}
                  className="text-[#C8A96E] mt-0.5 shrink-0 opacity-70"
                />
                <a
                  href="tel:+212691999897"
                  className="text-[13px] text-white/35 hover:text-[#C8A96E] font-inter transition-colors"
                >
                  +212 691 999 897
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail
                  size={13}
                  className="text-[#C8A96E] mt-0.5 shrink-0 opacity-70"
                />
                <a
                  href="mailto:Soufianechahid30@gmail.com"
                  className="text-[13px] text-white/35 hover:text-[#C8A96E] font-inter transition-colors break-all"
                >
                  Soufianechahid30@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <MoroccanDivider />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <p className="text-[11px] text-white/18 font-inter tracking-wide">
            © {new Date().getFullYear()} Erg Chebbi Luxury. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="text-[11px] text-white/18 hover:text-[#C8A96E] font-inter tracking-wide transition-colors"
            >
              {t("footer.privacy")}
            </a>
            <a
              href="/terms"
              className="text-[11px] text-white/18 hover:text-[#C8A96E] font-inter tracking-wide transition-colors"
            >
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
