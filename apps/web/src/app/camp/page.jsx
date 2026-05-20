import ServicePage from "../../components/ServicePage";

const CAMP_HERO =
  "https://raw.createusercontent.com/31818ad2-6e92-46d0-bd13-4d456e9ea099/";

export default function CampPage() {
  return (
    <ServicePage
      category="camp"
      heroImage={CAMP_HERO}
      titleKey="services.camp"
      subtitleKey="services.campDesc"
      descriptionParts={[
        "Nestled at the foot of the towering dunes of Erg Chebbi, our luxury desert camp offers an experience that bridges the grandeur of the Sahara with the comfort of a boutique hotel.",
        "Each tent is individually appointed with premium bedding, handwoven Berber carpets, private en-suite facilities, and a terrace where the desert unfolds before you in every direction.",
        "As evening falls, the camp comes alive with traditional Berber music, the aroma of slow-cooked tagines, and a sky so thick with stars it feels like another world entirely.",
      ]}
    />
  );
}
