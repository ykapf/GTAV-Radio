import { OG_SIZE, previewImage } from "../lib/og";

export const alt = "Chinatown Wars Radio: every GTA Chinatown Wars station live in your browser";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return previewImage({
    game: "Chinatown Wars Radio",
    kicker: "Live GTA radio",
    tagline: "Every Chinatown Wars station, from Deadmau5 to DFA, synced like real radio so everyone hears the same song at the same second.",
    logos: [
      "radio_icons/chinatown-wars/deadmau5.png",
      "radio_icons/chinatown-wars/dj-khalil.png",
      "radio_icons/chinatown-wars/turntables-on-the-hudson.png",
      "radio_icons/chinatown-wars/tortoise.png",
    ],
  });
}
