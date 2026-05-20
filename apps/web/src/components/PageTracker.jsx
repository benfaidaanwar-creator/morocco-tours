import { useEffect } from "react";

export default function PageTracker() {
  useEffect(() => {
    try {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_path: window.location.pathname,
          referrer: document.referrer || null,
        }),
      }).catch(() => {});
    } catch (e) {
      /* silent */
    }
  }, []);

  return null;
}
