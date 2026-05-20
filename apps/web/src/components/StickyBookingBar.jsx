import { useState, useEffect } from "react";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { useCurrencyStore } from "../stores/currencyStore";
import useTranslation from "../hooks/useTranslation";

export default function StickyBookingBar({ offer }) {
  const [show, setShow] = useState(false);
  const { formatPrice } = useCurrencyStore();
  const { t, isRtl } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling down 400px
      setShow(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!offer) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="dark:bg-[#0A0A0A]/98 bg-white/98 backdrop-blur-xl border-t dark:border-white/10 border-gray-200 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Offer info */}
            <div className="hidden sm:flex items-center gap-4 flex-1 min-w-0">
              {offer.image_url && (
                <img
                  src={offer.image_url}
                  alt={offer.title_en}
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="min-w-0">
                <h3 className="text-sm font-semibold dark:text-white text-gray-900 font-inter truncate">
                  {offer.title_en}
                </h3>
                <div className="flex items-center gap-3 text-xs dark:text-white/50 text-gray-500 font-inter mt-1">
                  {offer.duration && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {offer.duration}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {isRtl ? "لكل شخص" : "Per person"}
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-xs dark:text-white/50 text-gray-500 font-inter">
                {t("common.from")}
              </p>
              <p className="text-2xl font-bold text-[#C8A96E] font-inter">
                {formatPrice(offer.price)}
              </p>
            </div>

            {/* CTA */}
            <a
              href={`/booking?offer=${offer.id}&category=${offer.category}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8A96E] text-white font-semibold rounded-lg hover:bg-[#B8955E] transition-all text-sm font-inter shadow-lg hover:shadow-xl shrink-0"
            >
              {t("common.bookNow")}
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
