import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import OfferCard from "../../components/OfferCard";
import FilterPanel from "../../components/FilterPanel";
import { OfferCardSkeleton } from "../../components/LoadingSkeleton";
import useTranslation from "../../hooks/useTranslation";

export default function OffersPage() {
  const { t, isRtl } = useTranslation();
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 1000],
    duration: "",
    difficulty: "",
  });

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const res = await fetch("/api/offers");
      if (!res.ok) throw new Error("Failed to fetch offers");
      return res.json();
    },
  });

  const filteredOffers = offers.filter((offer) => {
    if (filters.category && offer.category !== filters.category) return false;
    if (
      offer.price < filters.priceRange[0] ||
      offer.price > filters.priceRange[1]
    )
      return false;
    return true;
  });

  return (
    <div
      className="pt-28 pb-20 dark:bg-[#0A0A0A] bg-white min-h-screen"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair-display font-semibold dark:text-white text-gray-900 tracking-tight mb-4">
            {isRtl ? "جميع التجارب" : "All Experiences"}
          </h1>
          <p className="text-base dark:text-white/50 text-gray-500 font-inter max-w-2xl mx-auto">
            {isRtl
              ? "استكشف تجاربنا الفاخرة في قلب الصحراء"
              : "Explore our curated luxury experiences in the heart of the desert"}
          </p>
        </div>

        {/* Filter and Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm dark:text-white/60 text-gray-600 font-inter">
            {filteredOffers.length} {isRtl ? "تجربة" : "experiences"}
          </p>
          <FilterPanel onFilterChange={setFilters} />
        </div>

        {/* Offers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <OfferCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}

        {filteredOffers.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-base dark:text-white/50 text-gray-500 font-inter">
              {isRtl ? "لم يتم العثور على تجارب" : "No experiences found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
