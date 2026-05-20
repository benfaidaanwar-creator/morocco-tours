import { Clock, ArrowRight, Star, Heart } from "lucide-react";
import useTranslation from "../hooks/useTranslation";
import { getOfferField } from "../data/translations";
import { useWishlistStore } from "../stores/wishlistStore";
import { useCurrencyStore } from "../stores/currencyStore";

export default function OfferCard({ offer }) {
  const { t, lang, isRtl } = useTranslation();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { formatPrice } = useCurrencyStore();
  const title = getOfferField(offer, "title", lang);
  const subtitle = getOfferField(offer, "subtitle", lang);
  const description = getOfferField(offer, "description", lang);
  const features = getOfferField(offer, "included_features", lang);
  const featuresList = features ? features.split("|") : [];
  const inWishlist = isInWishlist(offer.id);

  return (
    <div
      className="group overflow-hidden relative"
      style={{
        background: "#0E0B08",
        border: "1px solid rgba(200,169,110,0.08)",
      }}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Image */}
      <div className="aspect-[16/10] overflow-hidden relative">
        {offer.image_url ? (
          <img
            src={offer.image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(200,169,110,0.12), rgba(200,169,110,0.04))",
            }}
          >
            <span className="text-[#C8A96E]/30 text-xs font-inter tracking-widest uppercase">
              No Image
            </span>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(14,11,8,0.85) 0%, transparent 60%)",
          }}
        />

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-inter font-semibold"
            style={{
              background: "rgba(8,7,5,0.85)",
              border: "1px solid rgba(200,169,110,0.2)",
            }}
          >
            <Star size={11} fill="#C8A96E" className="text-[#C8A96E]" />
            <span className="text-white">4.9</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleItem(offer.id);
            }}
            className="w-8 h-8 flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: "rgba(8,7,5,0.85)",
              border: "1px solid rgba(200,169,110,0.15)",
            }}
          >
            <Heart
              size={14}
              className={
                inWishlist ? "text-red-400 fill-red-400" : "text-white/50"
              }
            />
          </button>
        </div>

        {/* Price in image */}
        <div className="absolute bottom-4 right-4">
          <span className="px-4 py-1.5 text-sm font-semibold font-inter text-[#080705] bg-[#C8A96E]">
            {t("common.from")} {formatPrice(offer.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-5 bg-[#C8A96E]/50" />
          <p className="text-[10px] text-[#C8A96E]/70 tracking-[0.3em] uppercase font-inter">
            {subtitle}
          </p>
        </div>

        <h3
          className="font-playfair-display font-semibold text-white mb-2 group-hover:text-[#C8A96E] transition-colors duration-300"
          style={{ fontSize: "1.15rem" }}
        >
          {title}
        </h3>

        <p className="text-[13px] text-white/35 font-inter leading-relaxed mb-5 line-clamp-2">
          {description}
        </p>

        {/* Duration */}
        {offer.duration && (
          <div
            className="flex items-center gap-2 mb-5 pb-5"
            style={{ borderBottom: "1px solid rgba(200,169,110,0.08)" }}
          >
            <Clock size={13} className="text-[#C8A96E] opacity-60" />
            <span className="text-[12px] text-white/30 font-inter">
              {offer.duration}
            </span>
          </div>
        )}

        {/* Features */}
        {featuresList.length > 0 && (
          <div className="mb-6 space-y-2">
            {featuresList.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#C8A96E] text-xs mt-0.5 opacity-70">
                  ✓
                </span>
                <span className="text-[12px] text-white/35 font-inter leading-snug">
                  {feature.trim()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <a
          href={`/booking?offer=${offer.id}&category=${offer.category}`}
          className="group/btn flex items-center justify-between w-full px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase font-inter font-semibold text-[#080705] bg-[#C8A96E] hover:bg-[#D4B87A] transition-colors duration-200"
        >
          {t("common.bookThis")}
          <ArrowRight
            size={13}
            className="group-hover/btn:translate-x-1 transition-transform"
          />
        </a>
      </div>
    </div>
  );
}
