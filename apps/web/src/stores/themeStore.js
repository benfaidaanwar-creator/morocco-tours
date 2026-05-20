import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: "dark",
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      localStorage.setItem("ecl-theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  },
  initTheme: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ecl-theme");
      const theme = saved || "dark";
      set({ theme });
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  },
}));

export default useThemeStore;
