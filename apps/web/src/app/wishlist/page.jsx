import { useQuery } from "@tanstack/react-query";
import { Heart, Trash2 } from "lucide-react";
import { useWishlistStore } from "../../stores/wishlistStore";
import OfferCard from "../../components/OfferCard";
import useTranslation from "../../hooks/useTranslation";

export default function WishlistPage() {
  const { t, isRtl } = useTranslation();
  const { items, clearWishlist } = useWishlistStore();

  const { data: offers = [] } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const res = await fetch("/api/offers");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const wishlistOffers = offers.filter((offer) => items.includes(offer.id));

  return (
    <div
      className="pt-28 pb-20 dark:bg-[#0A0A0A] bg-white min-h-screen"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-[#C8A96E]/10 flex items-center justify-center">
                <Heart size={24} className="text-[#C8A96E]" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-playfair-display font-semibold dark:text-white text-gray-900">
                {isRtl ? "المفضلة" : "My Wishlist"}
              </h1>
            </div>
            <p className="text-sm dark:text-white/50 text-gray-500 font-inter">
              {wishlistOffers.length}{" "}
              {isRtl ? "تجربة محفوظة" : "saved experiences"}
            </p>
          </div>

          {wishlistOffers.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:text-white/60 text-gray-600 hover:border-red-500/50 hover:text-red-500 transition-colors text-sm font-inter"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">
                {isRtl ? "مسح الكل" : "Clear All"}
              </span>
            </button>
          )}
        </div>

        {/* Wishlist Grid */}
        {wishlistOffers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#C8A96E]/10 flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-[#C8A96E]/40" />
            </div>
            <h2 className="text-xl font-playfair-display font-semibold dark:text-white text-gray-900 mb-2">
              {isRtl ? "المفضلة فارغة" : "Your wishlist is empty"}
            </h2>
            <p className="text-sm dark:text-white/50 text-gray-500 font-inter mb-8">
              {isRtl
                ? "ابدأ بحفظ التجارب المفضلة لديك"
                : "Start saving your favorite experiences"}
            </p>
            <a
              href="/booking"
              className="inline-flex items-center px-6 py-3 bg-[#C8A96E] text-white font-semibold rounded-lg hover:bg-[#B8955E] transition-colors text-sm font-inter"
            >
              {t("nav.bookNow")}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
