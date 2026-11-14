import { useId } from "react";
const N = "M0,0 H58 A58,58 0 0 1 116,58 V150 H72 V58 A14,14 0 0 0 44,58 V150 H0 Z";
const RING =
  "M72,75 A75,75 0 1 0 222,75 A75,75 0 1 0 72,75 Z M116,75 A31,31 0 1 0 178,75 A31,31 0 1 0 116,75 Z";
/** naria mark: lowercase n and a share one stroke; only the shared area takes the brand color. */
export function NariaMark({
  height = 24,
  accent = "var(--nds-palette-blue-500, #5c8dc5)",
  title,
}: {
  height?: number;
  accent?: string;
  title?: string;
}) {
  const clip = useId();
  return (
    <svg
      className="nds-brand-mark"
      viewBox="0 0 222 150"
      height={height}
      width={(height * 222) / 150}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <clipPath id={clip}>
        <path d={N} />
      </clipPath>
      <path d={N} fill="currentColor" />
      <path d={RING} fillRule="evenodd" fill="currentColor" />
      <rect x="178" width="44" height="150" fill="currentColor" />
      <path d={RING} fillRule="evenodd" fill={accent} clipPath={`url(#${clip})`} />
    </svg>
  );
}
