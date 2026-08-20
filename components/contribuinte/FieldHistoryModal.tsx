"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { CampoHistoricoRow, ContribuinteFicha } from "@/lib/mock/contribuinte-detalhe";

interface FieldHistoryModalProps {
  title: string;
  rows: CampoHistoricoRow[];
  ficha: ContribuinteFicha;
  onClose: () => void;
}

export function FieldHistoryModal({ title, rows, ficha, onClose }: FieldHistoryModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="ga-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Histórico do campo ${title}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="ga-modal" style={{ maxWidth: 620, maxHeight: "82vh" }}>
        <div className="ga-modal-head">
          <div className="ga-stack-2" style={{ gap: 4 }}>
            <span className="ga-overline">Histórico do campo</span>
            <span className="ga-section-title">{title}</span>
            <span className="ga-body-sm ga-muted">
              {ficha.razaoSocial} · CNPJ {ficha.cnpj}
            </span>
          </div>
          <button type="button" className="ga-modal-close" onClick={onClose} aria-label="Fechar">
            <X size={14} />
          </button>
        </div>
        <div className="ga-modal-body" style={{ padding: "8px 12px 14px", gap: 0 }}>
          {rows.map((row) => (
            <div
              key={`${row.date}-${row.value}`}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: 14,
                alignItems: "start",
                padding: "13px 14px",
                borderRadius: 9,
              }}
            >
              <span
                className="ga-mono"
                style={{ fontWeight: 500, fontSize: 12.5, color: "var(--ga-gray-700)" }}
              >
                {row.date}
              </span>
              <span className="ga-stack-2" style={{ gap: 2 }}>
                <span className="ga-cell-primary">{row.value}</span>
                <span className="ga-caption">{row.meta}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="ga-modal-foot" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="ga-btn ga-btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
