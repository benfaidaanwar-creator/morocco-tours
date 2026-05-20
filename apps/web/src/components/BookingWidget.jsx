import { useState } from "react";
import { Calendar, Users, Search, ArrowRight } from "lucide-react";
import useTranslation from "../hooks/useTranslation";
import { CATEGORIES } from "../data/translations";

export default function BookingWidget({ compact = false }) {
  const { t, isRtl } = useTranslation();
  const [form, setForm] = useState({
    category: "",
    guests: 2,
    date: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (form.category) params.set("category", form.category);
    if (form.guests) params.set("guests", form.guests);
    window.location.href = `/booking?${params.toString()}`;
  };

  if (compact) {
    return (
      <div
        className="flex items-center gap-2 p-2 rounded-xl border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <select
          value={form.category}
          onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          className="flex-1 px-3 py-2 rounded-lg dark:bg-[#0A0A0A] bg-gray-50 dark:text-white text-gray-900 text-sm font-inter border-0 focus:outline-none focus:ring-1 focus:ring-[#C8A96E]"
        >
          <option value="">
            {isRtl ? "اختر التجربة" : "Choose experience"}
          </option>
          {CATEGORIES.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {t(cat.labelPath)}
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-[#C8A96E] text-white rounded-lg hover:bg-[#B8955E] transition-colors text-sm font-inter font-semibold flex items-center gap-1 shrink-0"
        >
          {isRtl ? "بحث" : "Search"}
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-2xl border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A]/80 bg-white/80 backdrop-blur-xl p-6 shadow-xl"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category */}
        <div>
          <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
            {isRtl ? "نوع التجربة" : "Experience Type"}
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((p) => ({ ...p, category: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#C8A96E]"
          >
            <option value="">{isRtl ? "كل الأنواع" : "All Types"}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {t(cat.labelPath)}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
            {isRtl ? "التاريخ" : "Date"}
          </label>
          <div className="relative">
            <Calendar
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white/40 text-gray-400 pointer-events-none"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#C8A96E]"
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
            {isRtl ? "عدد الضيوف" : "Guests"}
          </label>
          <div className="relative">
            <Users
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white/40 text-gray-400 pointer-events-none"
            />
            <input
              type="number"
              min="1"
              value={form.guests}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  guests: parseInt(e.target.value) || 1,
                }))
              }
              className="w-full pl-10 pr-4 py-3 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#C8A96E]"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C8A96E] text-white font-semibold rounded-lg hover:bg-[#B8955E] transition-all text-sm font-inter shadow-lg hover:shadow-xl"
      >
        <Search size={18} />
        {isRtl ? "البحث عن التجارب" : "Search Experiences"}
      </button>
    </div>
  );
}
