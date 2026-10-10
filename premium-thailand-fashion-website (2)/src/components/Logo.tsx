import React from "react";

/* ============================================================
   TOMSTILL — brand mark.
   A bold "T" monogram drawn as a single geometric glyph so it
   stays crisp at favicon size and on hangtags.
   ============================================================ */
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
    {/* T stem with full-width crossbar */}
    <path d="M13 6h6v13h5v3H8v-3h5V6z" fill="currentColor" />
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
    aria-label="TOMSTILL — go to homepage"
  >
    <span className="grid size-9 place-items-center rounded-lg bg-current/[0.06] border border-current/15 transition-transform duration-500 group-hover:rotate-[8deg]">
      <DawnMark size={19} />
    </span>
    {!compact && (
      <span className="leading-none">
        <span className="block text-[19px] font-extrabold uppercase tracking-[0.06em]">
          TOMSTILL
        </span>
        <span className="label-caps mt-1 block text-[8px] opacity-60">Kids &amp; Boys</span>
      </span>
    )}
  </button>
);
