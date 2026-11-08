import RadioWheel from "./components/RadioWheel";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel />
      <Footer />
    </main>
  );
}
