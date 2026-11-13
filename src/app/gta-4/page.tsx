import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Footer from "../components/Footer";
import { pageMetadata } from "../lib/og";
import { GTA_IV_TALK, GTA_IV_TRACKS } from "../lib/tracks/gta-4";

export const metadata: Metadata = pageMetadata("GTA IV RADIO", "Live GTA IV and Episodes from Liberty City radio in your browser, synced so everyone hears the same song at the same second.");

export default function GtaFour() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="gta-4" tracks={GTA_IV_TRACKS} talk={GTA_IV_TALK} />
      <Footer />
    </main>
  );
}
