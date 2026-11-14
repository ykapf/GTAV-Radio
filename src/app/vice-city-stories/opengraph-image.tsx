import { OG_SIZE, previewImage } from "../lib/og";

export const alt = "Vice City Stories Radio: every GTA Vice City Stories station live in your browser";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return previewImage({
    game: "Vice City Stories Radio",
    kicker: "Live GTA radio",
    tagline: "Every Vice City station from 1984, synced like real radio so everyone hears the same song at the same second.",
    logos: [
      "radio_icons/vice-city/flash-fm.png",
      "radio_icons/vice-city-stories/radio-espantoso.png",
      "radio_icons/vice-city-stories/emotion-98-3.png",
    ],
  });
}
