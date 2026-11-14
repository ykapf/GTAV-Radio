import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Footer from "../components/Footer";
import { pageMetadata } from "../lib/og";
import { GTA_2_TRACKS } from "../lib/tracks/gta-2";

export const metadata: Metadata = pageMetadata("GTA 2 RADIO", "Live GTA 2 radio in your browser, synced so everyone hears the same song at the same second.");

export default function Gta2() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="gta-2" tracks={GTA_2_TRACKS} />
      <Footer />
    </main>
  );
}
