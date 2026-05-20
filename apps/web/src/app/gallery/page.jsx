import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import ImageLightbox from "../../components/ImageLightbox";
import useTranslation from "../../hooks/useTranslation";
import HERO_IMAGES from "../../data/heroImages";

const CAMP_INTERIOR =
  "https://raw.createusercontent.com/d9c07556-a1b5-4a0c-84a9-6e2ef10250f2/";
const TRANSFER_IMG =
  "https://raw.createusercontent.com/a703f3cc-555d-4b6c-a750-4516f0893f6f/";

const DEFAULT_GALLERY = [
  {
    id: "h1",
    image_url: HERO_IMAGES[0].url,
    category: "camp",
    caption: "Luxury desert camp at sunset",
  },
  {
    id: "h2",
    image_url: HERO_IMAGES[1].url,
    category: "camel",
    caption: "Camel caravan at sunset",
  },
  {
    id: "h3",
    image_url: HERO_IMAGES[2].url,
    category: "quad",
    caption: "Quad biking adventure",
  },
  {
    id: "h4",
    image_url: HERO_IMAGES[3].url,
    category: "desert",
    caption: "Sunrise over dunes",
  },
  {
    id: "h5",
    image_url: CAMP_INTERIOR,
    category: "camp",
    caption: "Luxury tent interior",
  },
  {
    id: "h6",
    image_url: TRANSFER_IMG,
    category: "desert",
    caption: "Premium transfer service",
  },
];

const FILTER_KEYS = ["all", "camp", "camel", "quad", "desert"];

export default function GalleryPage() {
  const { t, isRtl } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null);

  const { data: dbImages = [] } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const res = await fetch("/api/gallery");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const allImages = dbImages.length > 0 ? dbImages : DEFAULT_GALLERY;
  const filtered =
    filter === "all"
      ? allImages
      : allImages.filter((img) => img.category === filter);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{ background: "#080705" }}>
      <section className="pt-28 pb-24" style={{ background: "#080705" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Header */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#C8A96E]" />
              <span className="text-[9px] text-[#C8A96E] tracking-[0.45em] uppercase font-inter">
                {isRtl ? "المعرض" : "Gallery"}
              </span>
            </div>
            <h1
              className="font-playfair-display font-semibold text-white tracking-tight mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              {t("gallery.title")}
            </h1>
            <p className="text-[15px] text-white/35 font-inter max-w-xl">
              {t("gallery.subtitle")}
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-12 flex-wrap">
            {FILTER_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="px-5 py-2 text-[10px] tracking-[0.2em] uppercase font-inter font-medium transition-all"
                style={
                  filter === key
                    ? { background: "#C8A96E", color: "#080705" }
                    : {
                        background: "transparent",
                        color: "rgba(255,255,255,0.35)",
                        border: "1px solid rgba(200,169,110,0.15)",
                      }
                }
              >
                {t(`gallery.${key}`)}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
            {filtered.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setLightbox({ images: filtered, index: idx })}
                className="block w-full overflow-hidden break-inside-avoid group relative"
                style={{ border: "1px solid rgba(200,169,110,0.06)" }}
              >
                <img
                  src={img.image_url}
                  alt={img.caption || "Gallery image"}
                  className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-600"
                />
                {/* Caption overlay on hover */}
                {img.caption && (
                  <div
                    className="absolute inset-0 flex items-end justify-start p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(8,7,5,0.7), transparent 60%)",
                    }}
                  >
                    <p className="text-[11px] text-white/70 font-inter tracking-wide">
                      {img.caption}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/20 font-inter text-sm tracking-widest uppercase">
                {isRtl ? "لا توجد صور" : "No images"}
              </p>
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
