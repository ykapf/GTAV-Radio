"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <nav
        className={` w-full flex flex-row justify-between items-center py-[28px] font-light text-3xl  cursor-none    bg-black h-[300px] px-[75px] 
        `}
      >
        {/* Footer content */}
        <div className=" text-white uppercase"></div>
        {/* Middle */}
        <Link className="   text-white cursor-none hover:underline " href="https://www.ykapf.com/">
          @ykapf.
        </Link>
      </nav>
    </>
  );
}
