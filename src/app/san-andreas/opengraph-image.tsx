import { OG_SIZE, previewImage } from "../lib/og";

export const alt = "San Andreas Radio: every GTA San Andreas station live in your browser";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return previewImage({
    game: "San Andreas",
    kicker: "Live GTA radio",
    tagline: "Every San Andreas station synced like real radio, so everyone hears the same song at the same second.",
    logos: [
      "radio_icons/san-andreas/radio-los-santos.png",
      "radio_icons/san-andreas/k-dst.png",
      "radio_icons/san-andreas/bounce-fm.png",
      "radio_icons/san-andreas/radio-x.png",
      "radio_icons/san-andreas/sf-ur.png",
      "radio_icons/san-andreas/k-jah-west.png",
    ],
  });
}
