import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react";

export default function AdminAnalytics({ data }) {
  const stats = [
    {
      icon: Calendar,
      label: "Total Bookings",
      value: data?.totalBookings || 0,
      change: "+12%",
      positive: true,
    },
    {
      icon: Users,
      label: "New Customers",
      value: data?.newCustomers || 0,
      change: "+8%",
      positive: true,
    },
    {
      icon: TrendingUp,
      label: "Revenue",
      value: `€${(data?.revenue || 0).toLocaleString()}`,
      change: "+23%",
      positive: true,
    },
    {
      icon: BarChart3,
      label: "Avg. Rating",
      value: data?.avgRating || "4.9",
      change: "+0.2",
      positive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-xl border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A]/50 bg-white"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#C8A96E]/10 flex items-center justify-center">
                <Icon size={20} className="text-[#C8A96E]" />
              </div>
              <span
                className={`text-xs font-medium font-inter ${
                  stat.positive ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold dark:text-white text-gray-900 font-inter mb-1">
              {stat.value}
            </p>
            <p className="text-xs dark:text-white/50 text-gray-500 font-inter">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
