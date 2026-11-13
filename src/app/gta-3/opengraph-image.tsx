import { OG_SIZE, previewImage } from "../lib/og";

export const alt = "GTA III Radio: every GTA III station live in your browser";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return previewImage({
    game: "GTA III Radio",
    kicker: "Live GTA radio",
    tagline: "Every Liberty City station from GTA III synced like real radio, so everyone hears the same song at the same second.",
    logos: [
      "radio_icons/gta-3/flashback-95-6.png",
      "radio_icons/gta-3/game-radio-fm.png",
      "radio_icons/gta-3/rise-fm.png",
      "radio_icons/gta-3/lips-106.png",
    ],
  });
}
