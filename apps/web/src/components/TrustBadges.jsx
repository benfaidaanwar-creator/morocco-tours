import { Shield, Award, Star, Users } from "lucide-react";

const BADGES = [
  { icon: Star, label: "4.9/5 Rating", sublabel: "2,000+ Reviews" },
  { icon: Users, label: "10,000+", sublabel: "Happy Travelers" },
  { icon: Shield, label: "Secure Booking", sublabel: "100% Protected" },
  { icon: Award, label: "Award Winning", sublabel: "Excellence 2024" },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {BADGES.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-4 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A]/50 bg-white"
          >
            <div className="w-12 h-12 rounded-full bg-[#C8A96E]/10 flex items-center justify-center mb-3">
              <Icon size={24} className="text-[#C8A96E]" />
            </div>
            <p className="text-base font-semibold dark:text-white text-gray-900 font-inter mb-1">
              {badge.label}
            </p>
            <p className="text-xs dark:text-white/50 text-gray-500 font-inter">
              {badge.sublabel}
            </p>
          </div>
        );
      })}
    </div>
  );
}
