import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Footer from "../components/Footer";
import { GTA_IV_TALK, GTA_IV_TRACKS } from "../lib/tracks/gta-4";

export const metadata: Metadata = {
  title: "GTA IV RADIO",
  description: "Listen to the GTA IV and Episodes from Liberty City radio stations on the web.",
};

export default function GtaFour() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="gta-4" tracks={GTA_IV_TRACKS} talk={GTA_IV_TALK} />
      <Footer />
    </main>
  );
}
