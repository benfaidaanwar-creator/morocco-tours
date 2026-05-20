import { useState } from "react";
import { X } from "lucide-react";

export default function FloatingWhatsApp() {
  const [show, setShow] = useState(false);

  return (
    <div className="fixed bottom-7 right-7 z-50 flex flex-col items-end gap-3">
      {show && (
        <div
          className="flex flex-col gap-3 p-5 w-64 shadow-2xl"
          style={{
            background: "#0C0A07",
            border: "1px solid rgba(200,169,110,0.15)",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-white font-inter mb-0.5">
                Erg Chebbi Luxury
              </p>
              <p className="text-[10px] text-white/30 font-inter">
                Usually replies instantly
              </p>
            </div>
            <button
              onClick={() => setShow(false)}
              className="text-white/25 hover:text-white transition-colors ml-2"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-[13px] text-white/55 font-inter leading-relaxed">
            Hello! How can we help you plan your desert experience?
          </p>
          <a
            href="https://wa.me/212691999897?text=Hello%2C%20I%20would%20like%20to%20book%20a%20desert%20experience."
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-2.5 text-[10px] tracking-[0.15em] uppercase font-inter font-semibold text-[#080705] bg-[#C8A96E] hover:bg-[#D4B87A] transition-colors"
          >
            Start Chat
          </a>
        </div>
      )}

      <button
        onClick={() => setShow(!show)}
        className="w-12 h-12 flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
        style={{ background: "#25D366" }}
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>
    </div>
  );
}
