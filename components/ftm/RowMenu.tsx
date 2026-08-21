"use client";

import { useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";

/**
 * Menu de linha `ga-menu`, aberto por `ga-row-menu-btn`. O estado de "qual menu está
 * aberto" vive no componente pai (um único id) — este componente só decide fechar
 * quando `open` é true e o clique acontece fora dele, ou quando `Esc` é pressionado.
 */
export function RowMenu({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <div className="ga-relative" ref={ref}>
      <button
        type="button"
        className="ga-row-menu-btn"
        aria-expanded={open}
        aria-label="Mais ações"
        onClick={() => onOpenChange(!open)}
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="ga-menu" style={{ right: 20, width: 252 }}>
          {children}
        </div>
      )}
    </div>
  );
}
