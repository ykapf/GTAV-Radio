import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Footer from "../components/Footer";
import { SAN_ANDREAS_TALK, SAN_ANDREAS_TRACKS } from "../lib/tracks/san-andreas";

export const metadata: Metadata = {
  title: "SAN ANDREAS RADIO",
  description: "Listen to the GTA San Andreas radio stations on the web.",
};

export default function SanAndreas() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="san-andreas" tracks={SAN_ANDREAS_TRACKS} talk={SAN_ANDREAS_TALK} />
      <Footer />
    </main>
  );
}
