import React from "react";
import { DawnMark } from "./Logo";

/* Infinite marquee strip — content duplicated for a seamless loop */

export const Marquee: React.FC<{
  items: string[];
  dark?: boolean;
  slow?: boolean;
  className?: string;
}> = ({ items, dark = false, slow = false, className = "" }) => {
  const Row = () => (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className={`whitespace-nowrap px-6 text-sm font-bold uppercase tracking-[0.28em] md:text-base ${
              dark ? "text-paper/85" : "text-ink/85"
            }`}
          >
            {item}
          </span>
          <DawnMark size={16} className={`shrink-0 ${dark ? "text-clay" : "text-clay"}`} />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`marquee-track relative flex overflow-hidden border-y py-4 ${
        dark ? "border-paper/10 bg-void" : "border-paper/10 bg-cream"
      } ${className}`}
      aria-hidden="true"
    >
      <div className={`flex ${slow ? "animate-marquee-slow" : "animate-marquee"}`}>
        <Row />
        <Row />
      </div>
    </div>
  );
};
