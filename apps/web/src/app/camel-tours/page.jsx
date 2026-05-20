import ServicePage from "../../components/ServicePage";

const CAMEL_HERO =
  "https://raw.createusercontent.com/5b291b50-b41b-4fdc-80e6-490b7f2573a0/";

export default function CamelToursPage() {
  return (
    <ServicePage
      category="camel"
      heroImage={CAMEL_HERO}
      titleKey="services.camel"
      subtitleKey="services.camelDesc"
      descriptionParts={[
        "The camel has been the ship of the desert for thousands of years, carrying traders, travelers, and storytellers across the vast Saharan expanse. Today, we invite you to continue that timeless tradition.",
        "Our camel treks are led by experienced Berber guides who were born in these dunes and know every ridge, every shadow, and every hidden viewpoint that makes Erg Chebbi one of the most photogenic landscapes on Earth.",
        "Whether you choose a sunset ride, a dawn patrol, or a full caravan journey, each trek is an intimate encounter with the desert — a chance to slow down, breathe deeply, and witness nature at its most magnificent.",
      ]}
    />
  );
}
