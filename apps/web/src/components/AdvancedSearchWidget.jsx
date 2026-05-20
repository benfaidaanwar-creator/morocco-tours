import { useState } from "react";
import { Search, Calendar, Users, MapPin } from "lucide-react";
import useTranslation from "../hooks/useTranslation";
import { CATEGORIES } from "../data/translations";

export default function AdvancedSearchWidget() {
  const { t, isRtl } = useTranslation();
  const [search, setSearch] = useState({
    destination: "",
    category: "",
    guests: 2,
    date: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.category) params.set("category", search.category);
    if (search.guests) params.set("guests", search.guests);
    window.location.href = `/booking?${params.toString()}`;
  };

  return (
    <div
      className="w-full max-w-5xl mx-auto bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl rounded-2xl shadow-2xl border dark:border-white/10 border-gray-200 p-6"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destination */}
        <div className="relative">
          <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
            {isRtl ? "الوجهة" : "Destination"}
          </label>
          <div className="relative">
            <MapPin
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white/40 text-gray-400"
            />
            <input
              type="text"
              value={search.destination}
              onChange={(e) =>
                setSearch((p) => ({ ...p, destination: e.target.value }))
              }
              placeholder={isRtl ? "عرق الشبي، مرزوكة" : "Erg Chebbi, Merzouga"}
              className="w-full pl-10 pr-4 py-3 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white dark:text-white text-gray-900 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#C8A96E] focus:border-transparent placeholder:dark:text-white/30 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
            {isRtl ? "النوع" : "Experience Type"}
          </label>
          <select
            value={search.category}
            onChange={(e) =>
              setSearch((p) => ({ ...p, category: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white dark:text-white text-gray-900 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#C8A96E] focus:border-transparent"
          >
            <option value="">{isRtl ? "كل الأنواع" : "All Types"}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {t(cat.labelPath)}
              </option>
            ))}
          </select>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
            {isRtl ? "الضيوف" : "Guests"}
          </label>
          <div className="relative">
            <Users
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white/40 text-gray-400"
            />
            <input
              type="number"
              min="1"
              value={search.guests}
              onChange={(e) =>
                setSearch((p) => ({ ...p, guests: parseInt(e.target.value) }))
              }
              className="w-full pl-10 pr-4 py-3 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white dark:text-white text-gray-900 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#C8A96E] focus:border-transparent"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#C8A96E] text-white font-semibold rounded-lg hover:bg-[#B8955E] transition-all text-sm font-inter shadow-lg hover:shadow-xl"
          >
            <Search size={18} />
            {isRtl ? "بحث" : "Search"}
          </button>
        </div>
      </div>
    </div>
  );
}
