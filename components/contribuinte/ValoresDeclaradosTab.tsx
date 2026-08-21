"use client";

import { useState } from "react";
import type { PeriodoValores, ValoresDeclarados } from "@/lib/mock/contribuinte-detalhe";
import { TAB_META } from "./tab-meta";
import { TabPageHead } from "./TabPageHead";
import { SearchInput } from "./SearchInput";

const PERIODO_LABEL: Record<PeriodoValores, string> = {
  "12m": "últimos 12 meses",
  ano: "ano calendário 2026",
  esp: "ano especificado",
};

export function ValoresDeclaradosTab({ dados }: { dados: ValoresDeclarados }) {
  const [periodo, setPeriodo] = useState<PeriodoValores>("12m");
  const [query, setQuery] = useState("");

  const colunas = dados.periodos.slice(0, dados.colunasPorIntervalo[periodo]);
  const q = query.trim().toLowerCase();
  const rubricas = dados.rubricas.filter(
    (r) => q === "" || `${r.code} ${r.desc}`.toLowerCase().includes(q),
  );

  return (
    <>
      <TabPageHead tab="valores-declarados">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={TAB_META["valores-declarados"].searchPlaceholder}
        />
        <select
          className="ga-select"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value as PeriodoValores)}
          aria-label="Intervalo de períodos"
        >
          <option value="12m">Últimos 12 meses</option>
          <option value="ano">Ano calendário</option>
          <option value="esp">Especificar ano…</option>
        </select>
      </TabPageHead>

      <div className="ga-table-wrap">
        <div className="ga-table-toolbar">
          <span className="ga-card-title">Rubricas da apuração — {PERIODO_LABEL[periodo]}</span>
          <span className="ga-pagination-info">Valores em reais · fonte EFD ICMS/IPI</span>
        </div>
        <div className="ga-matrix">
          <table className="ga-table ga-table-zebra" style={{ minWidth: 1900 }}>
            <thead>
              <tr>
                <th style={{ width: 420 }}>Rubrica</th>
                {colunas.map((mes) => (
                  <th key={mes} style={{ width: 110, textAlign: "right" }}>
                    {mes}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rubricas.map((rubrica) => (
                <tr key={rubrica.code}>
                  <td>
                    <span className="ga-stack-2" style={{ gap: 2 }}>
                      <span
                        className="ga-mono"
                        style={{ fontWeight: 500, color: "var(--ga-primary-600)" }}
                      >
                        {rubrica.code}
                      </span>
                      <span className="ga-caption" style={{ textWrap: "pretty" }}>
                        {rubrica.desc}
                      </span>
                    </span>
                  </td>
                  {colunas.map((mes) => (
                    <td key={`${rubrica.code}-${mes}`} className="ga-table-num">
                      {dados.valorCelula}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rubricas.length === 0 && (
          <div className="ga-body-sm ga-muted" style={{ padding: "24px 20px 26px" }}>
            Nenhuma rubrica encontrada.
          </div>
        )}
        <div className="ga-pagination">
          <span className="ga-pagination-info">
            Mostrando <strong>{rubricas.length}</strong> de <strong>{dados.rubricas.length}</strong>{" "}
            rubricas
          </span>
          <span className="ga-footer-version">
            role na horizontal para ver os {colunas.length} períodos
          </span>
        </div>
      </div>
    </>
  );
}
