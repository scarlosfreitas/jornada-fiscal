import type { IconProps } from "./types";

export function RelatoriosIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20V9M10 20V4M16 20v-7M22 20H2" />
    </svg>
  );
}
