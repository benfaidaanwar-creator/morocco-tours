import { useState } from "react";
import { Star, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";
import useTranslation from "../hooks/useTranslation";

const REVIEWS = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "London, UK",
    rating: 5,
    date: "March 2024",
    title: "Unforgettable Desert Experience",
    text: "The luxury camp exceeded all expectations. The sunset camel ride, the traditional dinner, and the stargazing were absolutely magical. The staff were incredibly hospitable and made us feel like family.",
    image: null,
    helpful: 24,
  },
  {
    id: 2,
    name: "Marco Rossi",
    location: "Milan, Italy",
    rating: 5,
    date: "February 2024",
    title: "Perfect Adventure",
    text: "The quad biking through the dunes was thrilling! Our guide was professional and made sure we had a safe yet exciting experience. Highly recommend for adventure seekers.",
    image: null,
    helpful: 18,
  },
  {
    id: 3,
    name: "Emma Schmidt",
    location: "Berlin, Germany",
    rating: 5,
    date: "January 2024",
    title: "Luxury in the Sahara",
    text: "From the pickup to drop-off, everything was perfectly organized. The tent was beautiful, the food was delicious, and waking up to the sunrise over the dunes was a dream come true.",
    image: null,
    helpful: 31,
  },
  {
    id: 4,
    name: "Ahmed Al-Rashid",
    location: "Dubai, UAE",
    rating: 5,
    date: "December 2023",
    title: "Authentic Berber Hospitality",
    text: "As someone who has traveled extensively, this was one of the most authentic and well-organized desert experiences I have had. The cultural immersion was genuine and respectful.",
    image: null,
    helpful: 15,
  },
];

export default function FeaturedReviews() {
  const { isRtl } = useTranslation();
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % REVIEWS.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);

  const review = REVIEWS[current];

  return (
    <div
      className="rounded-xl border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A]/50 bg-white p-6 sm:p-8 relative"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(review.rating)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className="text-[#C8A96E] fill-[#C8A96E]"
              />
            ))}
          </div>
          <h3 className="text-lg font-semibold dark:text-white text-gray-900 font-inter mb-1">
            {review.title}
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-lg border dark:border-white/10 border-gray-200 hover:border-[#C8A96E]/50 flex items-center justify-center transition-colors"
          >
            <ChevronLeft
              size={16}
              className="dark:text-white/60 text-gray-600"
            />
          </button>
          <button
            onClick={next}
            className="w-8 h-8 rounded-lg border dark:border-white/10 border-gray-200 hover:border-[#C8A96E]/50 flex items-center justify-center transition-colors"
          >
            <ChevronRight
              size={16}
              className="dark:text-white/60 text-gray-600"
            />
          </button>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-sm dark:text-white/70 text-gray-600 font-inter leading-relaxed mb-6 italic">
        "{review.text}"
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t dark:border-white/10 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C8A96E]/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-[#C8A96E] font-inter">
              {review.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold dark:text-white text-gray-900 font-inter">
              {review.name}
            </p>
            <p className="text-xs dark:text-white/40 text-gray-400 font-inter">
              {review.location} • {review.date}
            </p>
          </div>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border dark:border-white/10 border-gray-200 hover:border-[#C8A96E]/50 transition-colors text-xs font-inter dark:text-white/60 text-gray-600">
          <ThumbsUp size={12} />
          <span>{review.helpful}</span>
        </button>
      </div>

      {/* Indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {REVIEWS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === current
                ? "w-6 bg-[#C8A96E]"
                : "w-1.5 dark:bg-white/20 bg-gray-300 hover:bg-[#C8A96E]/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
