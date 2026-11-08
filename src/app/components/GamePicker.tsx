"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { GAMES, Game } from "../lib/games";

/** The page title doubles as a dropdown that switches between each game's radio. */
export default function GamePicker({ current }: { current: Game }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <h1 className="font-headline text-3xl leading-none md:text-4xl">
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={`${current.title}. Choose a game`}
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-3 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
        >
          {current.title}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="square"
            className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </h1>

      {open && (
        <ul id={listId} className="absolute left-0 top-full z-30 mt-3 w-64 border border-cream/70 bg-black">
          <li className="border-b border-cream/20 px-4 py-3 text-[10px] uppercase tracking-[0.3em] text-cream/50">Choose a game</li>
          {GAMES.map((game) => {
            const active = game.id === current.id;
            return (
              <li key={game.id}>
                <Link
                  href={game.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-[3rem] items-center justify-between gap-4 px-4 text-sm font-medium uppercase tracking-[0.15em] transition-colors duration-150 focus-visible:outline-none motion-reduce:transition-none ${
                    active ? "bg-cream text-black" : "text-cream hover:bg-cream/10 focus-visible:bg-cream/10"
                  }`}
                >
                  {game.title}
                  {active && (
                    <span aria-hidden="true" className="text-[9px] tracking-[0.3em]">
                      ● On
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
