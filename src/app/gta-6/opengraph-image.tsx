import { OG_SIZE, previewImage } from "../lib/og";

export const alt = "GTA VI Radio: Rockstar's official GTA VI station previews";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return previewImage({
    game: "GTA VI Radio",
    kicker: "Coming November 19",
    tagline: "All six official station previews from Rockstar, synced like real radio, with a live countdown to launch.",
    logos: [
      "radio_icons/gta-6/cocoteo-fm.jpg",
      "radio_icons/gta-6/back-country-radio.jpg",
      "radio_icons/gta-6/afrobank-fm.jpg",
      "radio_icons/gta-6/the-chamber-106-6.jpg",
      "radio_icons/gta-6/flash-fm.jpg",
      "radio_icons/gta-6/dirty-south-classics.jpg",
    ],
    roundLogos: true,
  });
}
