import ServicePage from "../../components/ServicePage";

const QUAD_HERO =
  "https://raw.createusercontent.com/45e412e5-6b91-4a6d-8771-14bf2a45eabf/";

export default function QuadAtvPage() {
  return (
    <ServicePage
      category="quad"
      heroImage={QUAD_HERO}
      titleKey="services.quad"
      subtitleKey="services.quadDesc"
      descriptionParts={[
        "For those who crave speed and adventure alongside the beauty of the Sahara, our quad biking experiences deliver an adrenaline rush like no other.",
        "Navigate sandy trails, race across open plains, and conquer dune ridges with the latest well-maintained quad bikes and the guidance of expert local riders who know every curve of this extraordinary terrain.",
        "From quick one-hour sprints to extended sunset-timed expeditions, every ride is an unforgettable blend of excitement, natural beauty, and the raw energy of the desert.",
      ]}
    />
  );
}
