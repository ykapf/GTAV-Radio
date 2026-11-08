import RadioWheel from "./components/RadioWheel";
import Footer from "./components/Footer";
import { PLAYLIST_TRACKS } from "./lib/broadcast";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="gta-v" tracks={PLAYLIST_TRACKS} />
      <Footer />
    </main>
  );
}
