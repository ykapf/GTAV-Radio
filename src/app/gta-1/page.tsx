import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Footer from "../components/Footer";
import { pageMetadata } from "../lib/og";
import { GTA_1_TRACKS } from "../lib/tracks/gta-1";

export const metadata: Metadata = pageMetadata("GTA 1 RADIO", "Live radio from the original GTA in your browser, synced so everyone hears the same song at the same second.");

export default function Gta1() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="gta-1" tracks={GTA_1_TRACKS} />
      <Footer />
    </main>
  );
}
