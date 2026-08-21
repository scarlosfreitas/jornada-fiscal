"use client";

export function Switch({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`ga-switch${on ? " is-on" : ""}`}
      onClick={onToggle}
    >
      <span className="ga-switch-knob" />
    </button>
  );
}
