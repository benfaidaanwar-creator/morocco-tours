import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, MapPin } from "lucide-react";

const NOTIFICATIONS = [
  {
    name: "Sarah from Paris",
    action: "booked a Luxury Desert Camp",
    time: "2 minutes ago",
    country: "France",
  },
  {
    name: "John from London",
    action: "booked a Camel Trek",
    time: "5 minutes ago",
    country: "UK",
  },
  {
    name: "Maria from Madrid",
    action: "booked a Quad Adventure",
    time: "8 minutes ago",
    country: "Spain",
  },
  {
    name: "Ahmed from Dubai",
    action: "booked a Private Transfer",
    time: "12 minutes ago",
    country: "UAE",
  },
  {
    name: "Emma from Berlin",
    action: "booked a Sunset Tour",
    time: "15 minutes ago",
    country: "Germany",
  },
];

export default function SocialProofNotification() {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Show notification every 10 seconds
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % NOTIFICATIONS.length);
      setShow(true);

      // Hide after 5 seconds
      setTimeout(() => setShow(false), 5000);
    }, 10000);

    // Show first notification after 3 seconds
    const initial = setTimeout(() => {
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(initial);
    };
  }, []);

  const notification = NOTIFICATIONS[current];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 50, x: "-50%" }}
          className="fixed bottom-6 left-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="rounded-xl border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A]/95 bg-white/95 backdrop-blur-xl shadow-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C8A96E]/10 flex items-center justify-center shrink-0">
                <CheckCircle size={20} className="text-[#C8A96E]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold dark:text-white text-gray-900 font-inter mb-1">
                  {notification.name}
                </p>
                <p className="text-xs dark:text-white/60 text-gray-600 font-inter mb-1">
                  {notification.action}
                </p>
                <div className="flex items-center gap-2 text-xs dark:text-white/40 text-gray-400 font-inter">
                  <MapPin size={10} />
                  <span>{notification.country}</span>
                  <span>•</span>
                  <span>{notification.time}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
