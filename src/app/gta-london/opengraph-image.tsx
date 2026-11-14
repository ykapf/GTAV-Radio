import { OG_SIZE, previewImage } from "../lib/og";

export const alt = "GTA London Radio: every GTA London 1969 and 1961 station live in your browser";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return previewImage({
    game: "GTA London Radio",
    kicker: "Live GTA radio",
    tagline: "Every station from GTA London 1969 and 1961, synced like real radio so everyone hears the same song at the same second.",
    logos: [
      "radio_icons/gta-london/bush-sounds.png",
      "radio_icons/gta-london/kaleidoscope.png",
      "radio_icons/gta-london/westminster-wireless.png",
      "radio_icons/gta-london/funktastic.png",
    ],
  });
}
