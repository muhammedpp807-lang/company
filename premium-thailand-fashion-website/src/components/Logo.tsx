import React from "react";

/** ARUN dawn mark — sun rising over the horizon */
export const DawnMark: React.FC<{ size?: number; className?: string }> = ({
  size = 22,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M9 21a7 7 0 0 1 14 0"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      className="text-clay"
    />
    <line x1="4.5" y1="21" x2="27.5" y2="21" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    <line x1="16" y1="6.5" x2="16" y2="11" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export const Logo: React.FC<{
  dark?: boolean;
  compact?: boolean;
  onClick?: () => void;
}> = ({ dark = false, compact = false, onClick }) => (
  <button
    onClick={onClick}
    className={`group flex items-center gap-2.5 ${dark ? "text-paper" : "text-ink"}`}
    aria-label="ARUN — go to homepage"
  >
    <span className="grid size-9 place-items-center rounded-lg bg-current/[0.06] border border-current/15 transition-transform duration-500 group-hover:rotate-[15deg]">
      <DawnMark size={20} />
    </span>
    {!compact && (
      <span className="leading-none">
        <span className="block text-[19px] font-extrabold tracking-[0.02em]">ARUN®</span>
        <span className="label-caps mt-1 block text-[8px] opacity-60">Bangkok · Est. 2026</span>
      </span>
    )}
  </button>
);
