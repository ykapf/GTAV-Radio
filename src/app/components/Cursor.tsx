"use client";
import React, { useEffect, useState } from "react"; // Corrected the import statement.

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const mouseMove = (e: any) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return (
    <div
      className=" cursor"
      style={{
        left: `${mousePosition.x - 12}px`,
        top: `${mousePosition.y - 4}px`,
        height: "32px",
        width: "32px",
        borderRadius: "50%",
        position: "fixed",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <img className="" src="cursor.png" alt="cursor" style={{ maxWidth: "100%", maxHeight: "100%" }} />
    </div>
  );
}
