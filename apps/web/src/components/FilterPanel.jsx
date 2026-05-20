import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import useTranslation from "../hooks/useTranslation";
import { CATEGORIES } from "../data/translations";

export default function FilterPanel({ onFilterChange }) {
  const { t, isRtl } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 1000],
    duration: "",
    difficulty: "",
  });

  const handleApply = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      category: "",
      priceRange: [0, 1000],
      duration: "",
      difficulty: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white hover:border-[#C8A96E]/50 transition-colors text-sm font-inter"
      >
        <SlidersHorizontal
          size={16}
          className="dark:text-white/60 text-gray-600"
        />
        <span className="dark:text-white text-gray-900">
          {isRtl ? "تصفية" : "Filters"}
        </span>
      </button>

      {/* Filter Panel Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <div
            className="relative w-full sm:max-w-lg bg-white dark:bg-[#0A0A0A] rounded-t-2xl sm:rounded-2xl border-t sm:border dark:border-white/10 border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto"
            dir={isRtl ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-[#0A0A0A] border-b dark:border-white/10 border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold dark:text-white text-gray-900 font-inter">
                {isRtl ? "تصفية النتائج" : "Filter Results"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
              >
                <X size={20} className="dark:text-white/60 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Category */}
              <div>
                <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
                  {isRtl ? "الفئة" : "Category"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() =>
                        setFilters((p) => ({
                          ...p,
                          category: p.category === cat.key ? "" : cat.key,
                        }))
                      }
                      className={`px-4 py-2 rounded-lg border text-sm font-medium font-inter transition-colors ${
                        filters.category === cat.key
                          ? "border-[#C8A96E] bg-[#C8A96E]/10 text-[#C8A96E]"
                          : "dark:border-white/10 border-gray-200 dark:text-white/60 text-gray-600 hover:border-[#C8A96E]/50"
                      }`}
                    >
                      {t(cat.labelPath)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
                  {isRtl ? "نطاق السعر" : "Price Range"}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      setFilters((p) => ({
                        ...p,
                        priceRange: [parseInt(e.target.value), p.priceRange[1]],
                      }))
                    }
                    className="flex-1 px-4 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white dark:text-white text-gray-900 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#C8A96E]"
                    placeholder="Min"
                  />
                  <span className="dark:text-white/40 text-gray-400">—</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters((p) => ({
                        ...p,
                        priceRange: [p.priceRange[0], parseInt(e.target.value)],
                      }))
                    }
                    className="flex-1 px-4 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white dark:text-white text-gray-900 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#C8A96E]"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
                  {isRtl ? "المدة" : "Duration"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Half Day", "Full Day", "Multi-Day"].map((dur) => (
                    <button
                      key={dur}
                      onClick={() =>
                        setFilters((p) => ({
                          ...p,
                          duration: p.duration === dur ? "" : dur,
                        }))
                      }
                      className={`px-3 py-2 rounded-lg border text-xs font-medium font-inter transition-colors ${
                        filters.duration === dur
                          ? "border-[#C8A96E] bg-[#C8A96E]/10 text-[#C8A96E]"
                          : "dark:border-white/10 border-gray-200 dark:text-white/60 text-gray-600 hover:border-[#C8A96E]/50"
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
                  {isRtl ? "الصعوبة" : "Difficulty"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Easy", "Moderate", "Challenging"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() =>
                        setFilters((p) => ({
                          ...p,
                          difficulty: p.difficulty === diff ? "" : diff,
                        }))
                      }
                      className={`px-3 py-2 rounded-lg border text-xs font-medium font-inter transition-colors ${
                        filters.difficulty === diff
                          ? "border-[#C8A96E] bg-[#C8A96E]/10 text-[#C8A96E]"
                          : "dark:border-white/10 border-gray-200 dark:text-white/60 text-gray-600 hover:border-[#C8A96E]/50"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-[#0A0A0A] border-t dark:border-white/10 border-gray-200 px-6 py-4 flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2.5 rounded-lg border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 font-medium text-sm font-inter hover:border-[#C8A96E]/50 transition-colors"
              >
                {isRtl ? "إعادة تعيين" : "Reset"}
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#C8A96E] text-white font-semibold text-sm font-inter hover:bg-[#B8955E] transition-colors"
              >
                {isRtl ? "تطبيق" : "Apply Filters"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
