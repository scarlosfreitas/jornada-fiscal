"use client";

import { useState } from "react";
import type { CampoCadastral, ContribuinteFicha } from "@/lib/mock/contribuinte-detalhe";
import { TabPageHead } from "./TabPageHead";
import { FieldHistoryModal } from "./FieldHistoryModal";

interface SituacaoCadastralTabProps {
  campos: CampoCadastral[];
  ficha: ContribuinteFicha;
}

export function SituacaoCadastralTab({ campos, ficha }: SituacaoCadastralTabProps) {
  const [aberto, setAberto] = useState<CampoCadastral | null>(null);

  return (
    <>
      <TabPageHead tab="situacao-cadastral" />

      <div className="ga-card" style={{ overflow: "hidden" }}>
        {campos.map((campo) => (
          <div className="ga-field-row" key={campo.label}>
            <span className="ga-overline">{campo.label}</span>
            <span className={`ga-field-value${campo.mono ? " ga-mono" : ""}`}>{campo.value}</span>
            <span className="ga-body-sm ga-muted">{campo.since}</span>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {campo.rows && (
                <button
                  type="button"
                  className="ga-link-chip"
                  onClick={() => setAberto(campo)}
                >
                  Histórico
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="ga-pagination">
          <span className="ga-pagination-info">
            Mostrando <strong>{campos.length}</strong> de <strong>{campos.length}</strong> campos
          </span>
        </div>
      </div>

      {aberto && (
        <FieldHistoryModal
          title={aberto.label}
          rows={aberto.rows ?? []}
          ficha={ficha}
          onClose={() => setAberto(null)}
        />
      )}
    </>
  );
}
