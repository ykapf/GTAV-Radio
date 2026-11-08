import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Footer from "../components/Footer";
import { GTA_III_TALK, GTA_III_TRACKS } from "../lib/tracks/gta-3";

export const metadata: Metadata = {
  title: "GTA III RADIO",
  description: "Listen to the GTA III radio stations on the web.",
};

export default function GtaThree() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="gta-3" tracks={GTA_III_TRACKS} talk={GTA_III_TALK} />
      <Footer />
    </main>
  );
}
