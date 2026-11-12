import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Countdown from "../components/Countdown";
import Footer from "../components/Footer";
import { GTA_VI_PREVIEWS } from "../lib/tracks/gta-6";

export const metadata: Metadata = {
  title: "GTA VI RADIO",
  description: "Grand Theft Auto VI is coming soon. Listen to Rockstar's previews of the GTA VI radio stations on the web.",
};

export default function GtaSix() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="gta-6" tracks={{}} previews={GTA_VI_PREVIEWS} banner={<Countdown />} />
      <Footer />
    </main>
  );
}
