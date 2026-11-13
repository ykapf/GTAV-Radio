import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Countdown from "../components/Countdown";
import Footer from "../components/Footer";
import { pageMetadata } from "../lib/og";
import { GTA_VI_PREVIEWS } from "../lib/tracks/gta-6";

export const metadata: Metadata = pageMetadata("GTA VI RADIO", "GTA VI is coming November 19. Listen to Rockstar's six official GTA VI radio station previews, synced like real radio.");

export default function GtaSix() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="gta-6" tracks={{}} previews={GTA_VI_PREVIEWS} banner={<Countdown />} />
      <Footer />
    </main>
  );
}
