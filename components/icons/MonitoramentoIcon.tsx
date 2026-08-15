import type { IconProps } from "./types";

export function MonitoramentoIcon({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12h4l3-7 4 14 3-7h6" />
    </svg>
  );
}
