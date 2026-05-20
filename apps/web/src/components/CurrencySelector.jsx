import { DollarSign } from "lucide-react";
import { useCurrencyStore } from "../stores/currencyStore";

const CURRENCIES = [
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GBP", symbol: "£", name: "Pound" },
  { code: "MAD", symbol: "MAD", name: "Dirham" },
];

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrencyStore();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white hover:border-[#C8A96E]/50 transition-colors text-sm font-inter">
        <DollarSign size={14} className="dark:text-white/60 text-gray-600" />
        <span className="dark:text-white text-gray-900 font-medium">
          {currency}
        </span>
      </button>

      <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {CURRENCIES.map((curr) => (
          <button
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className={`w-full text-left px-4 py-2.5 text-sm font-inter transition-colors first:rounded-t-lg last:rounded-b-lg ${
              currency === curr.code
                ? "bg-[#C8A96E]/10 text-[#C8A96E] font-medium"
                : "dark:text-white/70 text-gray-700 hover:bg-[#C8A96E]/5"
            }`}
          >
            <span className="font-medium">{curr.symbol}</span> {curr.name}
          </button>
        ))}
      </div>
    </div>
  );
}
