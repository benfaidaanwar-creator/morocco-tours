import ServicePage from "../../components/ServicePage";

const TRANSFER_HERO =
  "https://raw.createusercontent.com/6c0ae477-02e7-46e6-ae28-e375928847b6/";

export default function TransfersPage() {
  return (
    <ServicePage
      category="transfer"
      heroImage={TRANSFER_HERO}
      titleKey="services.transfer"
      subtitleKey="services.transferDesc"
      descriptionParts={[
        "Your journey to the Sahara should be as comfortable and stress-free as the experiences that await you. Our professional transfer service ensures a seamless connection between the airport and your accommodation in Merzouga.",
        "Our fleet of premium vehicles is driven by multilingual, experienced drivers who know the roads intimately. Cold refreshments, comfortable seating, and Wi-Fi keep you relaxed throughout the journey.",
        "We serve all major airports in the region — Errachidia, Ouarzazate, and custom routes from Marrakech and Fez — with VIP private transfer options for guests who desire the highest level of service.",
      ]}
    />
  );
}
