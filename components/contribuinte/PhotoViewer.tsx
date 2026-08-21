"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Foto } from "@/lib/mock/contribuinte-detalhe";

export function PhotoViewer({ fotos }: { fotos: Foto[] }) {
  const [index, setIndex] = useState(0);

  if (fotos.length === 0) return null;

  const foto = fotos[index];

  return (
    <div className="ga-photo-frame">
      <div className="ga-row" style={{ gap: 14 }}>
        <button
          type="button"
          className="ga-photo-nav"
          aria-label="Foto anterior"
          onClick={() => setIndex((i) => (i - 1 + fotos.length) % fotos.length)}
        >
          <ChevronLeft size={14} />
        </button>
        <div className="ga-photo-slot">{foto.slot}</div>
        <button
          type="button"
          className="ga-photo-nav"
          aria-label="Próxima foto"
          onClick={() => setIndex((i) => (i + 1) % fotos.length)}
        >
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="ga-row-between" style={{ paddingLeft: 46 }}>
        <span className="ga-body-sm ga-muted">{foto.caption}</span>
        <span className="ga-caption ga-mono">
          {index + 1} / {fotos.length}
        </span>
      </div>
    </div>
  );
}
