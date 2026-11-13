import { OG_SIZE, previewImage } from "./lib/og";

export const alt = "GTA V Radio: every GTA V station live in your browser";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return previewImage({
    game: "GTA V Radio",
    kicker: "Live GTA radio",
    tagline: "Every station synced like real radio, so everyone hears the same song at the same second. Ad breaks included.",
    logos: [
      "radio_icons/non-stop-pop-fm.png",
      "radio_icons/los-santos-rock-radio.png",
      "radio_icons/radio-los-santos.png",
      "radio_icons/fly-lo-fm.png",
      "radio_icons/channel-x.png",
      "radio_icons/worldwide-fm.png",
    ],
  });
}
