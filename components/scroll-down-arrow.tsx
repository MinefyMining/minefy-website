"use client";

import { ChevronDown } from "lucide-react";

export function ScrollDownArrow() {
  function handleClick() {
    const hero = document.querySelector("section");
    if (!hero) return;
    const nextSection = hero.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <button
      onClick={handleClick}
      className="mt-6 text-white/80 hover:text-white transition-colors animate-bounce"
      aria-label="Scroll down"
    >
      <ChevronDown className="h-16 w-16" />
    </button>
  );
}
