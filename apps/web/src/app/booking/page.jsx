import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  Calendar,
} from "lucide-react";
import useTranslation from "../../hooks/useTranslation";
import { getOfferField, CATEGORIES } from "../../data/translations";
import { useCurrencyStore } from "../../stores/currencyStore";

const STEPS = ["step1", "step2", "step3", "step4"];

export default function BookingPage() {
  const { t, lang, isRtl } = useTranslation();
  const { formatPrice, convert } = useCurrencyStore();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    category: "",
    offer_id: null,
    check_in: null,
    check_out: null,
    activity_date: null,
    adults: 1,
    children: 0,
    full_name: "",
    email: "",
    phone: "",
    country: "",
    preferred_language: lang,
    special_requests: "",
    payment_method: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const offerId = params.get("offer");
    if (category) setForm((p) => ({ ...p, category }));
    if (offerId) setForm((p) => ({ ...p, offer_id: parseInt(offerId) }));
  }, []);

  const { data: offers = [] } = useQuery({
    queryKey: ["offers-all"],
    queryFn: async () => {
      const res = await fetch("/api/offers");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: paymentMethods = [] } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const res = await fetch("/api/payment-methods");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: availabilityData = [] } = useQuery({
    queryKey: ["availability", form.offer_id],
    queryFn: async () => {
      if (!form.offer_id) return [];
      const res = await fetch(`/api/availability?offer_id=${form.offer_id}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!form.offer_id,
  });

  const filteredOffers = form.category
    ? offers.filter((o) => o.category === form.category)
    : offers;
  const selectedOffer = offers.find((o) => o.id === form.offer_id);
  const isCamp = selectedOffer?.category === "camp";

  const unavailableDates = useMemo(() => {
    return availabilityData
      .filter((a) => !a.is_available || a.booked_count >= a.total_capacity)
      .map((a) => new Date(a.available_date));
  }, [availabilityData]);

  // Get date range for styling
  const selectedRange = useMemo(() => {
    if (form.check_in && form.check_out) {
      return { from: form.check_in, to: form.check_out };
    }
    return null;
  }, [form.check_in, form.check_out]);

  const estimatedTotal = useMemo(() => {
    if (!selectedOffer) return 0;
    const basePrice = parseFloat(selectedOffer.price);
    if (isCamp && form.check_in && form.check_out) {
      const nights = Math.ceil(
        (new Date(form.check_out) - new Date(form.check_in)) /
          (1000 * 60 * 60 * 24),
      );
      return basePrice * Math.max(1, nights) * (form.adults || 1);
    }
    return basePrice * (form.adults || 1);
  }, [selectedOffer, form.check_in, form.check_out, form.adults, isCamp]);

  const nightCount = useMemo(() => {
    if (!form.check_in || !form.check_out) return 0;
    return Math.ceil(
      (new Date(form.check_out) - new Date(form.check_in)) /
        (1000 * 60 * 60 * 24),
    );
  }, [form.check_in, form.check_out]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const body = {
        offer_id: form.offer_id,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        country: form.country,
        preferred_language: form.preferred_language,
        category: form.category,
        offer_title: selectedOffer
          ? getOfferField(selectedOffer, "title", "en")
          : "",
        check_in: form.check_in
          ? form.check_in.toISOString().split("T")[0]
          : null,
        check_out: form.check_out
          ? form.check_out.toISOString().split("T")[0]
          : null,
        activity_date: form.activity_date
          ? form.activity_date.toISOString().split("T")[0]
          : null,
        adults: form.adults,
        children: form.children,
        special_requests: form.special_requests,
        payment_method: form.payment_method,
        estimated_total: estimatedTotal,
      };
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Booking failed");
      setResult("success");
    } catch (err) {
      console.error(err);
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  }, [form, selectedOffer, estimatedTotal]);

  const canProceed = useCallback(() => {
    if (step === 0) return form.category && form.offer_id;
    if (step === 1) {
      if (isCamp) return form.check_in && form.check_out;
      return form.activity_date;
    }
    if (step === 2) return form.full_name && form.email;
    return form.payment_method;
  }, [step, form, isCamp]);

  const inputClass =
    "w-full px-4 py-3 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white dark:text-white text-gray-900 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#C8A96E] focus:border-transparent placeholder:dark:text-white/30 placeholder:text-gray-400";

  const calendarModifiers = {
    selected: selectedRange ? [selectedRange.from, selectedRange.to] : [],
    range_middle:
      selectedRange && form.check_in && form.check_out
        ? { after: form.check_in, before: form.check_out }
        : undefined,
  };

  const calendarStyles = {
    selected: { backgroundColor: "#C8A96E", color: "white", fontWeight: "600" },
    range_middle: { backgroundColor: "#C8A96E20", color: "#C8A96E" },
    today: { fontWeight: "bold", color: "#C8A96E" },
  };

  if (result === "success") {
    return (
      <div
        className="pt-28 pb-20 min-h-screen"
        style={{ background: "#080705" }}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-playfair-display font-semibold text-white mb-4">
            {t("booking.success")}
          </h1>
          <p className="text-sm text-white/40 font-inter mb-8">
            {isRtl
              ? "سيتم الاتصال بك قريباً لتأكيد التفاصيل."
              : "We will contact you shortly to confirm the details."}
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8A96E] text-white font-semibold rounded-full hover:bg-[#B8955E] transition-colors text-sm font-inter"
          >
            {t("nav.home")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pt-24 pb-20 min-h-screen"
      style={{ background: "#080705" }}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Add custom calendar styling */}
      <style jsx global>{`
        .rdp {
          --rdp-cell-size: 42px;
          --rdp-accent-color: #C8A96E;
          --rdp-background-color: #C8A96E20;
          margin: 0;
        }
        
        .rdp-months {
          justify-content: center;
        }
        
        .rdp-month {
          background: transparent;
        }
        
        .rdp-caption {
          display: flex;
          justify-content: center;
          padding: 0.5rem 0;
          margin-bottom: 0.5rem;
        }
        
        .rdp-caption_label {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary, #fff);
        }
        
        .rdp-head_cell {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary, rgba(255,255,255,0.5));
          text-transform: uppercase;
          padding: 0.25rem;
        }
        
        .rdp-cell {
          padding: 2px;
        }
        
        .rdp-day {
          border-radius: 0.5rem;
          font-size: 0.9rem;
          transition: all 0.2s;
          color: var(--text-primary, #fff);
        }
        
        .rdp-day:hover:not(.rdp-day_disabled):not(.rdp-day_selected) {
          background-color: rgba(200, 169, 110, 0.1);
          color: #C8A96E;
        }
        
        .rdp-day_selected {
          background-color: #C8A96E !important;
          color: white !important;
          font-weight: 600;
        }
        
        .rdp-day_disabled {
          opacity: 0.25;
          cursor: not-allowed;
          text-decoration: line-through;
          color: var(--text-disabled, rgba(255,255,255,0.2));
        }
        
        .rdp-day_today:not(.rdp-day_selected) {
          font-weight: bold;
          color: #C8A96E;
          border: 1px solid #C8A96E;
        }
        
        /* Range styling for sequential days */
        .rdp-day_range_start,
        .rdp-day_range_end {
          background-color: #C8A96E !important;
          color: white !important;
        }
        
        .rdp-day_range_middle {
          background-color: rgba(200, 169, 110, 0.15) !important;
          color: #C8A96E !important;
          border-radius: 0 !important;
        }
        
        .rdp-nav {
          display: flex;
          gap: 0.5rem;
        }
        
        .rdp-nav_button {
          width: 32px;
          height: 32px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary, #fff);
          transition: all 0.2s;
        }
        
        .rdp-nav_button:hover {
          background-color: rgba(200, 169, 110, 0.1);
          color: #C8A96E;
        }
        
        .rdp-nav_button_previous,
        .rdp-nav_button_next {
          opacity: 1;
        }
        
        /* Dark mode specific */
        .dark .rdp-caption_label {
          color: #fff;
        }
        
        .dark .rdp-head_cell {
          color: rgba(255, 255, 255, 0.4);
        }
        
        .dark .rdp-day {
          color: #fff;
        }
        
        /* Light mode specific */
        .rdp-caption_label {
          color: #111;
        }
        
        .rdp-head_cell {
          color: rgba(0, 0, 0, 0.5);
        }
        
        .rdp-day {
          color: #111;
        }
        
        .rdp-day_disabled {
          color: rgba(0, 0, 0, 0.2);
        }
        
        .dark .rdp-day_disabled {
          color: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-playfair-display font-semibold text-white tracking-tight mb-3">
            {t("booking.title")}
          </h1>
          <p className="text-sm text-white/50 font-inter">
            {t("booking.subtitle")}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-1 mb-10">
          {STEPS.map((s, idx) => {
            const isActive = idx === step;
            const isComplete = idx < step;
            return (
              <div key={s} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium font-inter transition-colors ${
                    isActive
                      ? "bg-[#C8A96E] text-white"
                      : isComplete
                        ? "bg-[#C8A96E]/20 text-[#C8A96E]"
                        : "dark:bg-white/5 bg-gray-100 dark:text-white/40 text-gray-400"
                  }`}
                >
                  {isComplete ? <Check size={12} /> : <span>{idx + 1}</span>}
                  <span className="hidden sm:inline">{t(`booking.${s}`)}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-8 h-px mx-1 ${idx < step ? "bg-[#C8A96E]" : "dark:bg-white/10 bg-gray-200"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="rounded-xl border dark:border-white/10 border-gray-200 p-6 sm:p-8 dark:bg-[#1A1A1A]/30 bg-white">
          {/* Step 1: Choose Experience */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
                  {t("booking.category")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          category: cat.key,
                          offer_id: null,
                        }))
                      }
                      className={`px-4 py-3 rounded-lg border text-sm font-medium font-inter transition-colors ${
                        form.category === cat.key
                          ? "border-[#C8A96E] bg-[#C8A96E]/10 text-[#C8A96E]"
                          : "dark:border-white/10 border-gray-200 dark:text-white/60 text-gray-600 hover:border-[#C8A96E]/50"
                      }`}
                    >
                      {t(cat.labelPath)}
                    </button>
                  ))}
                </div>
              </div>

              {form.category && (
                <div>
                  <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
                    {t("booking.offer")}
                  </label>
                  <div className="space-y-3">
                    {filteredOffers.map((offer) => {
                      const title = getOfferField(offer, "title", lang);
                      const subtitle = getOfferField(offer, "subtitle", lang);
                      const isSelected = form.offer_id === offer.id;
                      return (
                        <button
                          key={offer.id}
                          onClick={() =>
                            setForm((p) => ({ ...p, offer_id: offer.id }))
                          }
                          className={`w-full text-left p-4 rounded-lg border transition-colors ${
                            isSelected
                              ? "border-[#C8A96E] bg-[#C8A96E]/5"
                              : "dark:border-white/10 border-gray-200 hover:border-[#C8A96E]/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold dark:text-white text-gray-900 font-inter">
                                {title}
                              </p>
                              <p className="text-xs dark:text-white/50 text-gray-500 font-inter mt-0.5">
                                {subtitle}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-semibold text-[#C8A96E] font-inter">
                                {formatPrice(offer.price)}
                              </span>
                              {offer.duration && (
                                <p className="text-xs dark:text-white/40 text-gray-400 font-inter flex items-center gap-1 mt-0.5 justify-end">
                                  <Clock size={10} /> {offer.duration}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Dates & Guests */}
          {step === 1 && (
            <div className="space-y-6">
              {isCamp ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
                      {t("booking.checkIn")}
                    </label>
                    <div className="flex justify-center p-4 rounded-lg dark:bg-[#0A0A0A]/50 bg-gray-50">
                      <DayPicker
                        mode="single"
                        selected={form.check_in}
                        onSelect={(d) =>
                          setForm((p) => ({ ...p, check_in: d }))
                        }
                        disabled={[{ before: new Date() }, ...unavailableDates]}
                        modifiers={
                          form.check_in && form.check_out
                            ? {
                                range_start: form.check_in,
                                range_end: form.check_out,
                                range_middle: {
                                  after: form.check_in,
                                  before: form.check_out,
                                },
                              }
                            : {}
                        }
                        className="font-inter"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
                      {t("booking.checkOut")}
                    </label>
                    <div className="flex justify-center p-4 rounded-lg dark:bg-[#0A0A0A]/50 bg-gray-50">
                      <DayPicker
                        mode="single"
                        selected={form.check_out}
                        onSelect={(d) =>
                          setForm((p) => ({ ...p, check_out: d }))
                        }
                        disabled={[
                          { before: form.check_in || new Date() },
                          ...unavailableDates,
                        ]}
                        modifiers={
                          form.check_in && form.check_out
                            ? {
                                range_start: form.check_in,
                                range_end: form.check_out,
                                range_middle: {
                                  after: form.check_in,
                                  before: form.check_out,
                                },
                              }
                            : {}
                        }
                        className="font-inter"
                      />
                    </div>
                  </div>
                  {nightCount > 0 && (
                    <div className="md:col-span-2 flex items-center gap-2 p-3 rounded-lg bg-[#C8A96E]/10 text-[#C8A96E]">
                      <Calendar size={16} />
                      <span className="text-sm font-inter font-medium">
                        {nightCount} {t("booking.nights")}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
                    {t("booking.activityDate")}
                  </label>
                  <div className="flex justify-center p-4 rounded-lg dark:bg-[#0A0A0A]/50 bg-gray-50">
                    <DayPicker
                      mode="single"
                      selected={form.activity_date}
                      onSelect={(d) =>
                        setForm((p) => ({ ...p, activity_date: d }))
                      }
                      disabled={[{ before: new Date() }, ...unavailableDates]}
                      className="font-inter"
                    />
                  </div>
                </div>
              )}

              {/* Guests */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
                    {t("booking.adults")}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          adults: Math.max(1, p.adults - 1),
                        }))
                      }
                      className="w-10 h-10 rounded-lg border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 flex items-center justify-center text-lg hover:border-[#C8A96E]"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold dark:text-white text-gray-900 font-inter w-8 text-center">
                      {form.adults}
                    </span>
                    <button
                      onClick={() =>
                        setForm((p) => ({ ...p, adults: p.adults + 1 }))
                      }
                      className="w-10 h-10 rounded-lg border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 flex items-center justify-center text-lg hover:border-[#C8A96E]"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
                    {t("booking.children")}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          children: Math.max(0, p.children - 1),
                        }))
                      }
                      className="w-10 h-10 rounded-lg border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 flex items-center justify-center text-lg hover:border-[#C8A96E]"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold dark:text-white text-gray-900 font-inter w-8 text-center">
                      {form.children}
                    </span>
                    <button
                      onClick={() =>
                        setForm((p) => ({ ...p, children: p.children + 1 }))
                      }
                      className="w-10 h-10 rounded-lg border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 flex items-center justify-center text-lg hover:border-[#C8A96E]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Personal Info */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
                    {t("booking.fullName")} *
                  </label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, full_name: e.target.value }))
                    }
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
                    {t("booking.email")} *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
                    {t("booking.phone")}
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
                    {t("booking.country")}
                  </label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, country: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
                  {t("booking.specialRequests")}
                </label>
                <textarea
                  value={form.special_requests}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, special_requests: e.target.value }))
                  }
                  rows="3"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          )}

          {/* Step 4: Confirm & Pay */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="rounded-lg border dark:border-white/10 border-gray-200 p-5 space-y-3">
                <h3 className="text-base font-semibold dark:text-white text-gray-900 font-inter mb-3">
                  {isRtl ? "ملخص الحجز" : "Booking Summary"}
                </h3>
                {selectedOffer && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm dark:text-white/60 text-gray-500 font-inter">
                      {getOfferField(selectedOffer, "title", lang)}
                    </span>
                    <span className="text-sm font-semibold text-[#C8A96E] font-inter">
                      {formatPrice(selectedOffer.price)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm dark:text-white/60 text-gray-500 font-inter">
                    <Users size={14} className="inline mr-1" />
                    {form.adults} {t("booking.adults")}, {form.children}{" "}
                    {t("booking.children")}
                  </span>
                </div>
                {isCamp && nightCount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm dark:text-white/60 text-gray-500 font-inter">
                      {nightCount} {t("booking.nights")}
                    </span>
                  </div>
                )}
                <div className="border-t dark:border-white/10 border-gray-200 pt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold dark:text-white text-gray-900 font-inter">
                    {t("booking.estimatedTotal")}
                  </span>
                  <span className="text-xl font-semibold text-[#C8A96E] font-inter">
                    {formatPrice(estimatedTotal)}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-2 font-inter uppercase tracking-wider">
                  {t("booking.paymentMethod")}
                </label>
                <div className="space-y-2">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          payment_method: pm.method_type,
                        }))
                      }
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        form.payment_method === pm.method_type
                          ? "border-[#C8A96E] bg-[#C8A96E]/5"
                          : "dark:border-white/10 border-gray-200 hover:border-[#C8A96E]/50"
                      }`}
                    >
                      <span className="text-sm font-medium dark:text-white text-gray-900 font-inter">
                        {pm.method_name}
                      </span>
                    </button>
                  ))}
                  {paymentMethods.length === 0 && (
                    <div className="space-y-2">
                      {[
                        "Credit Card",
                        "PayPal",
                        "Bank Transfer",
                        "Pay on Arrival",
                      ].map((name) => {
                        const val = name.toLowerCase().replace(/ /g, "_");
                        return (
                          <button
                            key={val}
                            onClick={() =>
                              setForm((p) => ({ ...p, payment_method: val }))
                            }
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              form.payment_method === val
                                ? "border-[#C8A96E] bg-[#C8A96E]/5"
                                : "dark:border-white/10 border-gray-200 hover:border-[#C8A96E]/50"
                            }`}
                          >
                            <span className="text-sm font-medium dark:text-white text-gray-900 font-inter">
                              {name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {result === "error" && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-inter">
                  <AlertCircle size={16} /> {t("booking.error")}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 border dark:border-white/20 border-gray-300 dark:text-white text-gray-700 rounded-full hover:border-[#C8A96E] transition-colors text-sm font-inter disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft size={14} /> {t("booking.back")}
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C8A96E] text-white font-semibold rounded-full hover:bg-[#B8955E] transition-colors text-sm font-inter disabled:opacity-30 disabled:pointer-events-none"
            >
              {t("booking.next")} <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || submitting}
              className="inline-flex items-center gap-2 px-8 py-2.5 bg-[#C8A96E] text-white font-semibold rounded-full hover:bg-[#B8955E] transition-colors text-sm font-inter disabled:opacity-30 disabled:pointer-events-none"
            >
              {submitting ? t("booking.submitting") : t("booking.submit")}{" "}
              <Check size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
