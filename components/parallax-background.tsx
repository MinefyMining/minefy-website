"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

interface ParallaxBackgroundProps {
  src: string;
  alt: string;
}

export function ParallaxBackground({ src, alt }: ParallaxBackgroundProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!imageRef.current) return;
      const x = (e.clientX / globalThis.innerWidth - 0.5) * 120;
      imageRef.current.style.transform = `translateX(${x}px) scale(1.15)`;
    }

    globalThis.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => globalThis.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={imageRef}
      className="absolute inset-[-120px] transition-transform duration-300 ease-out will-change-transform"
      style={{ transform: "scale(1.15)" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
