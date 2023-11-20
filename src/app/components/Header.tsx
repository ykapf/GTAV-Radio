"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <nav
        className={` md:hidden w-full flex flex-row justify-end items-center py-[28px] font-light text-3xl      bg-black h-[100px] px-[50px] 
        `}
      >
        {/* Header content */}

        <div className="   text-white  font-bold">GTA V Radio</div>
      </nav>
    </>
  );
}
