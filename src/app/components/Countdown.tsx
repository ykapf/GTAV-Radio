"use client";

import { useEffect, useState } from "react";
import { GTA_VI_RELEASE } from "../lib/tracks/gta-6";

const UNITS = [
  { label: "Days", seconds: 86_400 },
  { label: "Hours", seconds: 3_600 },
  { label: "Minutes", seconds: 60 },
  { label: "Seconds", seconds: 1 },
];

const releaseMs = () => new Date(GTA_VI_RELEASE.year, GTA_VI_RELEASE.monthIndex, GTA_VI_RELEASE.day).getTime();

/** Live countdown to GTA VI's launch; it starts empty so the server render and first client render match. */
export default function Countdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, Math.floor((releaseMs() - Date.now()) / 1000)));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const out = left === 0;

  return (
    <section aria-label="Grand Theft Auto VI release countdown" className="border-b border-cream/20 px-6 py-6 md:px-12 lg:px-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Grand Theft Auto VI</p>
          <p className="mt-3 font-headline text-4xl leading-[0.95] md:text-5xl">{out ? "Out now" : `Coming ${GTA_VI_RELEASE.label}`}</p>
          <p className="mt-3 max-w-[60ch] text-sm font-light leading-relaxed text-cream/70">
            {out ? "The full radio lands with the game. Until then, these are Rockstar's station previews." : "Coming soon. Until launch, tune in to Rockstar's previews of six GTA VI stations."}
          </p>
        </div>
        {!out && (
          <dl className="grid grid-cols-4 border border-cream/25" aria-live="off">
            {UNITS.map((unit, i) => {
              const value = left === null ? null : i === 0 ? Math.floor(left / unit.seconds) : Math.floor(left / unit.seconds) % (i === 1 ? 24 : 60);
              return (
                <div key={unit.label} className={`flex min-w-[4.5rem] flex-col items-center px-3 py-3 md:min-w-[6rem] md:px-5 ${i ? "border-l border-cream/25" : ""}`}>
                  <dt className="order-2 mt-2 text-[10px] uppercase tracking-[0.3em] text-cream/50">{unit.label}</dt>
                  <dd className="order-1 whitespace-nowrap font-headline text-[clamp(2rem,6vw,3.25rem)] leading-none tabular-nums">
                    {value === null ? "--" : String(value).padStart(2, "0")}
                  </dd>
                </div>
              );
            })}
          </dl>
        )}
      </div>
    </section>
  );
}
