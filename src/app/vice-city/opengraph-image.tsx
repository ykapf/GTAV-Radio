import { OG_SIZE, previewImage } from "../lib/og";

export const alt = "Vice City Radio: every GTA Vice City station live in your browser";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return previewImage({
    game: "Vice City",
    kicker: "Live GTA radio",
    tagline: "Every Vice City station synced like real radio, so everyone hears the same song at the same second.",
    logos: [
      "radio_icons/vice-city/flash-fm.png",
      "radio_icons/vice-city/emotion-98-3.png",
      "radio_icons/vice-city/fever-105.png",
      "radio_icons/vice-city/wildstyle.png",
    ],
  });
}
