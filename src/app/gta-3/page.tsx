import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Footer from "../components/Footer";
import { pageMetadata } from "../lib/og";
import { GTA_III_TALK, GTA_III_TRACKS } from "../lib/tracks/gta-3";

export const metadata: Metadata = pageMetadata("GTA III RADIO", "Live GTA III radio in your browser, synced so everyone hears the same song at the same second.");

export default function GtaThree() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="gta-3" tracks={GTA_III_TRACKS} talk={GTA_III_TALK} />
      <Footer />
    </main>
  );
}
