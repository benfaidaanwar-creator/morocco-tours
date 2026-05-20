import { useEffect, useState } from "react";

const PAGE_BACKGROUNDS = {
  "/": "https://raw.createusercontent.com/31818ad2-6e92-46d0-bd13-4d456e9ea099/",
  "/camp":
    "https://raw.createusercontent.com/31818ad2-6e92-46d0-bd13-4d456e9ea099/",
  "/camel-tours":
    "https://raw.createusercontent.com/5b291b50-b41b-4fdc-80e6-490b7f2573a0/",
  "/quad-atv":
    "https://raw.createusercontent.com/45e412e5-6b91-4a6d-8771-14bf2a45eabf/",
  "/transfers":
    "https://raw.createusercontent.com/6c0ae477-02e7-46e6-ae28-e375928847b6/",
  "/gallery":
    "https://raw.createusercontent.com/4953192d-c0fc-4db1-8fe3-e3c6807b3525/",
  "/about":
    "https://raw.createusercontent.com/31818ad2-6e92-46d0-bd13-4d456e9ea099/",
  "/contact":
    "https://raw.createusercontent.com/6207fd14-e822-4e23-8b64-7529b0d04938/",
  "/booking":
    "https://raw.createusercontent.com/31818ad2-6e92-46d0-bd13-4d456e9ea099/",
  "/faq":
    "https://raw.createusercontent.com/31818ad2-6e92-46d0-bd13-4d456e9ea099/",
};

export default function PageBackground() {
  const [currentBg, setCurrentBg] = useState("");
  const [nextBg, setNextBg] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const updateBackground = () => {
      const path = window.location.pathname;
      const newBg = PAGE_BACKGROUNDS[path] || PAGE_BACKGROUNDS["/"];

      if (newBg !== currentBg && currentBg !== "") {
        // Start transition
        setNextBg(newBg);
        setIsTransitioning(true);

        // Complete transition after animation
        setTimeout(() => {
          setCurrentBg(newBg);
          setNextBg("");
          setIsTransitioning(false);
        }, 800);
      } else if (currentBg === "") {
        // Initial load
        setCurrentBg(newBg);
      }
    };

    updateBackground();

    // Listen for navigation events
    const handleNavigation = () => {
      setTimeout(updateBackground, 50);
    };

    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("pushstate", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("pushstate", handleNavigation);
    };
  }, [currentBg]);

  // Don't render on admin pages
  if (
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <>
      {/* Current Background */}
      {currentBg && (
        <div
          className="fixed inset-0 w-full h-full transition-opacity duration-800 ease-in-out pointer-events-none"
          style={{
            opacity: isTransitioning ? 0 : 1,
            zIndex: -2,
          }}
        >
          <img
            src={currentBg}
            alt="Page background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 dark:bg-[#0A0A0A]/85 bg-white/90" />
        </div>
      )}

      {/* Next Background (during transition) */}
      {nextBg && (
        <div
          className="fixed inset-0 w-full h-full transition-opacity duration-800 ease-in-out pointer-events-none"
          style={{
            opacity: isTransitioning ? 1 : 0,
            zIndex: -1,
          }}
        >
          <img
            src={nextBg}
            alt="Page background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 dark:bg-[#0A0A0A]/85 bg-white/90" />
        </div>
      )}
    </>
  );
}
