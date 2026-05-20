export default function Logo({
  className = "",
  variant = "full",
  size = "md",
}) {
  const sizes = {
    sm: { height: 32 },
    md: { height: 42 },
    lg: { height: 52 },
    xl: { height: 64 },
  };
  const s = sizes[size] || sizes.md;

  const logoUrl =
    "https://raw.createusercontent.com/7fb67cfb-4c92-4890-b77d-b372b88a2c52/";

  if (variant === "icon") {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src={logoUrl}
          alt="Erg Chebbi Luxury"
          style={{ height: s.height }}
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <a
      href="/"
      className={`inline-flex items-center no-underline group ${className}`}
    >
      <img
        src={logoUrl}
        alt="Erg Chebbi Luxury"
        style={{ height: s.height }}
        className="object-contain group-hover:opacity-90 transition-opacity"
      />
    </a>
  );
}
