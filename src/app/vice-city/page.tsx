import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Footer from "../components/Footer";
import { VICE_CITY_TALK, VICE_CITY_TRACKS } from "../lib/tracks/vice-city";

export const metadata: Metadata = {
  title: "VICE CITY RADIO",
  description: "Listen to the GTA Vice City radio stations on the web.",
};

export default function ViceCity() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="vice-city" tracks={VICE_CITY_TRACKS} talk={VICE_CITY_TALK} />
      <Footer />
    </main>
  );
}
