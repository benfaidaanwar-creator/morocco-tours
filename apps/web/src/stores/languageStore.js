import { create } from "zustand";

const useLanguageStore = create((set) => ({
  lang: "en",
  setLang: (lang) => {
    set({ lang });
    if (typeof window !== "undefined") {
      localStorage.setItem("ecl-lang", lang);
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
    }
  },
  initLang: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ecl-lang");
      const lang = saved || "en";
      set({ lang });
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
    }
  },
}));

export default useLanguageStore;
