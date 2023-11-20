import Image from "next/image";
import RadioWheel from "./components/RadioWheel";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className=" flex min-h-screen  flex-col items-center justify-center bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-300 via-green-400 to-rose-700 ">
      <div className="md:h-screen flex flex-col items-center justify-center ">
        <RadioWheel />
      </div>

      <Footer />
    </main>
  );
}
