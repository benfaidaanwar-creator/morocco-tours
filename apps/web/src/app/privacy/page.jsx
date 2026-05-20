import useTranslation from "../../hooks/useTranslation";

export default function PrivacyPage() {
  const { isRtl } = useTranslation();

  return (
    <div
      className="pt-28 pb-20 dark:bg-[#0A0A0A] bg-white"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-playfair-display font-semibold dark:text-white text-gray-900 tracking-tight mb-8">
          Privacy Policy
        </h1>
        <div className="prose dark:prose-invert max-w-none font-inter text-sm leading-relaxed dark:text-white/60 text-gray-600 space-y-6">
          <p>
            At Erg Chebbi Luxury, we respect your privacy and are committed to
            protecting your personal data. This policy explains how we collect,
            use, and safeguard your information when you visit our website or
            make a booking.
          </p>
          <h2 className="text-lg font-semibold dark:text-white text-gray-900 font-playfair-display">
            Information We Collect
          </h2>
          <p>
            We collect personal information that you voluntarily provide when
            making a booking or contacting us, including your name, email
            address, phone number, country of origin, and travel preferences.
          </p>
          <h2 className="text-lg font-semibold dark:text-white text-gray-900 font-playfair-display">
            How We Use Your Information
          </h2>
          <p>
            Your information is used to process bookings, communicate about your
            reservations, improve our services, and send relevant updates about
            our offerings. We do not sell or share your data with third parties
            for marketing purposes.
          </p>
          <h2 className="text-lg font-semibold dark:text-white text-gray-900 font-playfair-display">
            Data Security
          </h2>
          <p>
            We implement appropriate security measures to protect your personal
            data. All booking information is stored securely and access is
            restricted to authorized personnel only.
          </p>
          <h2 className="text-lg font-semibold dark:text-white text-gray-900 font-playfair-display">
            Contact
          </h2>
          <p>
            For any privacy-related inquiries, please contact us at{" "}
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
