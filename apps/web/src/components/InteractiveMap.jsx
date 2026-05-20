import { MapPin } from "lucide-react";
import useTranslation from "../hooks/useTranslation";

const LOCATION = {
  lat: 31.0801,
  lng: -4.0133,
  name: "Erg Chebbi, Merzouga",
  address: "Sahara Desert, Merzouga 52202, Morocco",
};

export default function InteractiveMap() {
  const { isRtl } = useTranslation();

  return (
    <div
      className="rounded-xl border dark:border-white/10 border-gray-200 overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Map container */}
      <div className="aspect-[16/9] relative">
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.234!2d${LOCATION.lng}!3d${LOCATION.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDA0JzQ4LjQiTiA0wrAwMCc0Ny45Ilc!5e0!3m2!1sen!2s!4v1234567890`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Erg Chebbi Location"
          className="w-full h-full"
        />
      </div>

      {/* Location info overlay */}
      <div className="p-5 dark:bg-[#1A1A1A] bg-white flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#C8A96E]/10 flex items-center justify-center shrink-0">
          <MapPin size={20} className="text-[#C8A96E]" />
        </div>
        <div>
          <h3 className="text-base font-semibold dark:text-white text-gray-900 font-inter mb-1">
            {LOCATION.name}
          </h3>
          <p className="text-sm dark:text-white/60 text-gray-600 font-inter">
            {LOCATION.address}
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${LOCATION.lat},${LOCATION.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-sm text-[#C8A96E] hover:text-[#B8955E] transition-colors font-inter font-medium"
          >
            {isRtl ? "عرض على الخريطة" : "View on Google Maps"} →
          </a>
        </div>
      </div>
    </div>
  );
}
