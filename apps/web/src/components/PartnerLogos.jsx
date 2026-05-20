import useTranslation from "../hooks/useTranslation";

const PARTNERS = [
  { name: "TripAdvisor", logo: "🏆" },
  { name: "Booking.com", logo: "🌟" },
  { name: "Trusted Partner", logo: "✓" },
  { name: "Excellence Award", logo: "🥇" },
  { name: "Eco Certified", logo: "🌿" },
  { name: "Safe Travels", logo: "🛡️" },
];

export default function PartnerLogos() {
  const { isRtl } = useTranslation();

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      <div className="text-center mb-8">
        <p className="text-xs font-medium uppercase tracking-wider dark:text-white/40 text-gray-400 font-inter">
          {isRtl ? "موثوق به من قبل" : "Trusted By"}
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {PARTNERS.map((partner, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-4 rounded-lg border dark:border-white/5 border-gray-100 dark:bg-[#1A1A1A]/30 bg-gray-50/50 hover:border-[#C8A96E]/30 transition-colors"
          >
            <div className="text-3xl mb-2 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              {partner.logo}
            </div>
            <p className="text-xs dark:text-white/40 text-gray-400 font-inter text-center">
              {partner.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
