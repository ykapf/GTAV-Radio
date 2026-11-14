import { OG_SIZE, previewImage } from "../lib/og";

export const alt = "GTA 1 Radio: every the original GTA station live in your browser";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return previewImage({
    game: "GTA 1 Radio",
    kicker: "Live GTA radio",
    tagline: "Every station from the original 1997 GTA, synced like real radio so everyone hears the same song at the same second.",
    logos: [
      "radio_icons/gta-1/head-radio.png",
      "radio_icons/gta-1/n-ct-fm.png",
      "radio_icons/gta-1/the-fix-fm.png",
      "radio_icons/gta-1/brooklyn-underground-fm.png",
    ],
  });
}
