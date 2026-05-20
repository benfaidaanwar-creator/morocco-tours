import { useState, useEffect } from "react";

export default function VideoBackground({
  videoUrl,
  posterUrl,
  children,
  overlayOpacity = 0.6,
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={posterUrl}
        onLoadedData={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Poster fallback */}
      {posterUrl && !isLoaded && (
        <img
          src={posterUrl}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
