import useLanguageStore from "../stores/languageStore";
import {
  t as translate,
  getOfferField as getField,
} from "../data/translations";

export default function useTranslation() {
  const lang = useLanguageStore((s) => s.lang);

  const t = (path) => translate(lang, path);
  const getOfferField = (offer, field) => getField(offer, field, lang);
  const isRtl = lang === "ar";

  return { t, lang, isRtl, getOfferField };
}
