import Image from "next/image";
import RadioWheel from "./components/RadioWheel";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      {/* <div className="">GTA V RADIO</div> */}
      <div className="flex flex-col items-center justify-center">
        <RadioWheel />
      </div>
    </main>
  );
}
