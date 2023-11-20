"use client";
import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mouseMove = (e: any) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
      setIsVisible(true);
    };

    const mouseOut = () => {
      setIsVisible(false);
    };

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseout", mouseOut);

    return () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseout", mouseOut);
    };
  }, []);

  return (
    <div
      className="cursor hidden sm:block"
      style={{
        left: `${mousePosition.x - 12}px`,
        top: `${mousePosition.y - 4}px`,
        height: "32px",
        width: "32px",
        borderRadius: "50%",
        position: "fixed",
        pointerEvents: "none",
        zIndex: 9999,
        visibility: isVisible ? "visible" : "hidden",
      }}
    >
      <img src="cursor.png" alt="Custom Cursor" style={{ maxWidth: "100%", maxHeight: "100%" }} />
    </div>
  );
}
