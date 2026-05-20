import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import useTranslation from "../hooks/useTranslation";

export default function FAQ({ items }) {
  const { isRtl } = useTranslation();
  const [search, setSearch] = useState("");
  const [openIdx, setOpenIdx] = useState(null);

  const filtered = items.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-white/40 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isRtl ? "ابحث في الأسئلة الشائعة..." : "Search FAQs..."}
          className="w-full pl-12 pr-4 py-3 rounded-xl border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white dark:text-white text-gray-900 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#C8A96E] focus:border-transparent placeholder:dark:text-white/30 placeholder:text-gray-400"
        />
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filtered.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A]/50 bg-white overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#C8A96E]/5 transition-colors"
              >
                <span className="text-sm font-semibold dark:text-white text-gray-900 font-inter pr-4">
                  {item.q}
                </span>
                {isOpen ? (
                  <ChevronUp size={18} className="text-[#C8A96E] shrink-0" />
                ) : (
                  <ChevronDown
                    size={18}
                    className="dark:text-white/40 text-gray-400 shrink-0"
                  />
                )}
              </button>
              {isOpen && (
                <div className="px-6 pb-5 border-t dark:border-white/10 border-gray-200 pt-4">
                  <p className="text-sm dark:text-white/60 text-gray-500 font-inter leading-relaxed">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm dark:text-white/50 text-gray-500 font-inter">
              {isRtl ? "لم يتم العثور على نتائج" : "No results found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
