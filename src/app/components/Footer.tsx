"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <nav
        className={` w-full flex flex-row justify-between items-center py-[28px] font-light text-3xl      bg-black h-[300px] px-[75px] 
        `}
      >
        {/* Footer content */}
        <div className=" bg-white rounded-full flex items-center justify-center w-[50px] hover:bg-gray-200 ">
          <Link className="   text-white  hover:underline " href="https://github.com/ykapf/GTAV-Radio">
            <img src="/github.png" className="w-full h-full inline-block -translate-y-[1px] scale-[1.02]" />
          </Link>
        </div>
        {/* Middle */}
        <Link className="   text-white  hover:underline " href="https://www.ykapf.com/">
          @ykapf.
        </Link>
      </nav>
    </>
  );
}
