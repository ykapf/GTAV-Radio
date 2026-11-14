import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Footer from "../components/Footer";
import { pageMetadata } from "../lib/og";
import { GTA_LONDON_TRACKS } from "../lib/tracks/gta-london";

export const metadata: Metadata = pageMetadata("GTA LONDON RADIO", "Live GTA London 1969 and 1961 radio in your browser, synced so everyone hears the same song at the same second.");

export default function GtaLondon() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="gta-london" tracks={GTA_LONDON_TRACKS} />
      <Footer />
    </main>
  );
}
