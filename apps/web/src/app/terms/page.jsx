import useTranslation from "../../hooks/useTranslation";

export default function TermsPage() {
  const { isRtl } = useTranslation();

  return (
    <div
      className="pt-28 pb-20 dark:bg-[#0A0A0A] bg-white"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-playfair-display font-semibold dark:text-white text-gray-900 tracking-tight mb-8">
          Terms of Service
        </h1>
        <div className="prose dark:prose-invert max-w-none font-inter text-sm leading-relaxed dark:text-white/60 text-gray-600 space-y-6">
          <p>
            Welcome to Erg Chebbi Luxury. By using our website and services, you
            agree to the following terms and conditions.
          </p>
          <h2 className="text-lg font-semibold dark:text-white text-gray-900 font-playfair-display">
            Bookings & Reservations
          </h2>
          <p>
            All bookings are subject to availability. A confirmation email will
            be sent upon successful booking submission. Final confirmation is
            provided after deposit receipt. Prices are quoted in Euros and may
            be subject to seasonal adjustments.
          </p>
          <h2 className="text-lg font-semibold dark:text-white text-gray-900 font-playfair-display">
            Cancellation Policy
          </h2>
          <p>
            Cancellations made more than 48 hours before the scheduled
            experience are eligible for a full refund of the deposit.
            Cancellations within 48 hours may incur a fee. No-shows are
            non-refundable.
          </p>
          <h2 className="text-lg font-semibold dark:text-white text-gray-900 font-playfair-display">
            Safety & Liability
          </h2>
          <p>
            All guests participate in activities at their own risk. We maintain
            high safety standards and provide safety briefings before all
            activities. Guests must follow guide instructions at all times.
          </p>
          <h2 className="text-lg font-semibold dark:text-white text-gray-900 font-playfair-display">
            Contact
          </h2>
          <p>
            For questions about these terms, contact us at{" "}
            <a
              href="mailto:Soufianechahid30@gmail.com"
              className="text-[#C8A96E]"
            >
              Soufianechahid30@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
