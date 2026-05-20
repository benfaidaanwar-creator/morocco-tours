import { useEffect, useState, useRef } from "react";
import { Users, Star, Award, MapPin } from "lucide-react";
import useTranslation from "../hooks/useTranslation";

const STATS = [
  { icon: Users, value: 10000, label: "Happy Travelers", suffix: "+" },
  {
    icon: Star,
    value: 4.9,
    label: "Average Rating",
    suffix: "/5",
    decimals: 1,
  },
  { icon: Award, value: 15, label: "Years Experience", suffix: "+" },
  { icon: MapPin, value: 50, label: "Desert Locations", suffix: "+" },
];

function useCountUp(end, duration = 2000, decimals = 0) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = end * easeOutQuart;

      setCount(currentValue);

      if (progress === 1) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, hasStarted]);

  return { count, start: () => setHasStarted(true) };
}

export default function StatsCounter() {
  const { isRtl } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-4 gap-6"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {STATS.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <StatItem
            key={idx}
            icon={Icon}
            value={stat.value}
            label={stat.label}
            suffix={stat.suffix}
            decimals={stat.decimals}
            startAnimation={isVisible}
          />
        );
      })}
    </div>
  );
}

function StatItem({
  icon: Icon,
  value,
  label,
  suffix,
  decimals = 0,
  startAnimation,
}) {
  const { count, start } = useCountUp(value, 2000, decimals);

  useEffect(() => {
    if (startAnimation) {
      start();
    }
  }, [startAnimation, start]);

  const displayValue =
    decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString();

  return (
    <div className="text-center p-6 rounded-xl border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A]/50 bg-white">
      <div className="w-12 h-12 rounded-full bg-[#C8A96E]/10 flex items-center justify-center mx-auto mb-3">
        <Icon size={24} className="text-[#C8A96E]" />
      </div>
      <p className="text-3xl font-bold dark:text-white text-gray-900 font-inter mb-1">
        {displayValue}
        {suffix}
      </p>
      <p className="text-xs dark:text-white/50 text-gray-500 font-inter uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}
