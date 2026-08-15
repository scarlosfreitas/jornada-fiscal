import type { IconProps } from "./types";

export function LogoIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    >
      <path d="M3 17c6 0 5-11 11-11" />
      <circle cx="19" cy="6" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
