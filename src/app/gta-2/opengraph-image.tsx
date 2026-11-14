import { OG_SIZE, previewImage } from "../lib/og";

export const alt = "GTA 2 Radio: every GTA 2 station live in your browser";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return previewImage({
    game: "GTA 2 Radio",
    kicker: "Live GTA radio",
    tagline: "Every GTA 2 station, from Head Radio to KGBH, synced like real radio so everyone hears the same song at the same second.",
    logos: [
      "radio_icons/gta-2/head-radio.png",
      "radio_icons/gta-2/funami-fm.png",
      "radio_icons/gta-2/krez.png",
      "radio_icons/gta-2/kgbh.png",
    ],
  });
}
