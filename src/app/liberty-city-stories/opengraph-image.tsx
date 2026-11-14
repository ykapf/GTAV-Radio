import { OG_SIZE, previewImage } from "../lib/og";

export const alt = "Liberty City Stories Radio: every GTA Liberty City Stories station live in your browser";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return previewImage({
    game: "Liberty City Stories Radio",
    kicker: "Live GTA radio",
    tagline: "Every Liberty City station from 1998, synced like real radio so everyone hears the same song at the same second.",
    logos: [
      "radio_icons/liberty-city-stories/head-radio.png",
      "radio_icons/liberty-city-stories/radio-del-mundo.png",
      "radio_icons/liberty-city-stories/rise-fm.png",
      "radio_icons/liberty-city-stories/lips-106.png",
    ],
  });
}
