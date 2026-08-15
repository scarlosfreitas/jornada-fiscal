import type { IconProps } from "./types";

export function OrdensServicoIcon({ className, style }: IconProps) {
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
      <path d="M9 4h6v3H9zM7 7h10v13H7zM10 12h4M10 16h4" />
    </svg>
  );
}
