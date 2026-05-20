import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (offerId) => {
        const { items } = get();
        if (!items.includes(offerId)) {
          set({ items: [...items, offerId] });
        }
      },

      removeItem: (offerId) => {
        set({ items: get().items.filter((id) => id !== offerId) });
      },

      toggleItem: (offerId) => {
        const { items } = get();
        if (items.includes(offerId)) {
          get().removeItem(offerId);
        } else {
          get().addItem(offerId);
        }
      },

      isInWishlist: (offerId) => {
        return get().items.includes(offerId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
    },
  ),
);
