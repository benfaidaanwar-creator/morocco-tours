import { create } from "zustand";
import { persist } from "zustand/middleware";

const EXCHANGE_RATES = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.86,
  MAD: 10.95,
};

export const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: "EUR",
      rates: EXCHANGE_RATES,

      setCurrency: (currency) => set({ currency }),

      convert: (amount, fromCurrency = "EUR") => {
        const { currency, rates } = get();
        const amountInEUR = amount / rates[fromCurrency];
        return amountInEUR * rates[currency];
      },

      formatPrice: (amount, fromCurrency = "EUR") => {
        const { currency, rates } = get();
        const converted = get().convert(amount, fromCurrency);
        const symbols = {
          EUR: "€",
          USD: "$",
          GBP: "£",
          MAD: "MAD ",
        };

        return currency === "MAD"
          ? `${symbols[currency]}${converted.toFixed(0)}`
          : `${symbols[currency]}${converted.toFixed(2)}`;
      },
    }),
    {
      name: "currency-storage",
    },
  ),
);
