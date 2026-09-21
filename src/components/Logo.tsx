/**
 * Relevnt — bespoke radar mark.
 * Concentric radar arcs (dashed ring sweeps), a needle sweep toward
 * upper-right, a bright blip on the target ring, crosshair axis ticks
 * and a center lock dot. Single accent color, stroke-based, round caps.
 */
export default function RelevntLogo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const c = "#4DE3FF";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g stroke={c} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle
          cx="24"
          cy="24"
          r="18"
          strokeWidth="2.2"
          strokeDasharray="86 27"
          transform="rotate(-130 24 24)"
        />
        <circle
          cx="24"
          cy="24"
          r="12"
          strokeWidth="1.8"
          strokeDasharray="57 39"
          transform="rotate(-70 24 24)"
          opacity="0.6"
        />
        <circle
          cx="24"
          cy="24"
          r="6"
          strokeWidth="1.4"
          strokeDasharray="19 37"
          transform="rotate(-130 24 24)"
          opacity="0.35"
        />
        <path d="M24 3.5v3.5M24 41v3.5M3.5 24h3.5M41 24h3.5" strokeWidth="1.6" opacity="0.5" />
        <path d="M24 24l14 0" strokeWidth="2.2" transform="rotate(-40 24 24)" opacity="0.9" />
      </g>
      <circle cx="35.5" cy="14.4" r="2.2" fill={c} />
      <circle cx="24" cy="24" r="2" fill={c} />
    </svg>
  );
}