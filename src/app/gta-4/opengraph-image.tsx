import { OG_SIZE, previewImage } from "../lib/og";

export const alt = "GTA IV Radio: every GTA IV and Episodes from Liberty City station live in your browser";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return previewImage({
    game: "GTA IV Radio",
    kicker: "Live GTA radio",
    tagline: "GTA IV, The Lost and Damned and The Ballad of Gay Tony, synced so everyone hears the same song at the same second.",
    logos: [
      "og-logos/gta-4/the-beat-102-7.png",
      "og-logos/gta-4/liberty-rock-radio.png",
      "og-logos/gta-4/vladivostok-fm.png",
      "og-logos/gta-4/k109-the-studio.png",
      "og-logos/gta-4/electro-choc.png",
      "og-logos/gta-4/the-journey.png",
    ],
  });
}
