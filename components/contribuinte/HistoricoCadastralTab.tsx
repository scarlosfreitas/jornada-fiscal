"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Columns3, ChevronDown, Check } from "lucide-react";
import type { HistoricoCadastral, HistoricoRegistro } from "@/lib/mock/contribuinte-detalhe";
import { TabPageHead } from "./TabPageHead";

/**
 * Mantém um registro apenas quando algum atributo comparável visível difere do
 * último registro mantido; as datas ficam fora da comparação. Precisa ser
 * recalculado a cada mudança na seleção de colunas.
 */
function deduzirLinhas(
  registros: HistoricoRegistro[],
  comparaveis: { key: string; field: keyof HistoricoRegistro }[],
) {
  const mantidos: { row: HistoricoRegistro; changed: string[] }[] = [];
  registros.forEach((row) => {
    const anterior = mantidos[mantidos.length - 1];
    if (!anterior) {
      mantidos.push({ row, changed: [] });
      return;
    }
    const changed = comparaveis
      .filter((c) => anterior.row[c.field] !== row[c.field])
      .map((c) => c.key);
    if (changed.length > 0) mantidos.push({ row, changed });
  });
  return mantidos;
}

export function HistoricoCadastralTab({ dados }: { dados: HistoricoCadastral }) {
  const { colunas, registros } = dados;
  const [selecionadas, setSelecionadas] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(colunas.map((c) => [c.key, true])),
  );
  const [menuAberto, setMenuAberto] = useState(false);

  const { visiveis, linhas } = useMemo(() => {
    const visiveis = colunas.filter((c) => c.fixed || selecionadas[c.key]);
    const mantidos = deduzirLinhas(
      registros,
      visiveis.filter((c) => c.compare),
    );
    const linhas = mantidos.map((item, i) => {
      const proximoAlterado = mantidos[i + 1]?.changed ?? [];
      return {
        key: item.row.cad_hist_ini,
        cells: visiveis.map((c) => ({
          key: c.key,
          text: item.row[c.field],
          /* destaque no valor que muda adiante e no que mudou em relação ao anterior */
          highlighted: proximoAlterado.includes(c.key) || item.changed.includes(c.key),
          mono: c.mono,
        })),
      };
    });
    return { visiveis, linhas };
  }, [registros, colunas, selecionadas]);

  function alternarColuna(key: string, fixed: boolean) {
    if (fixed) {
      toast("A coluna Data início é obrigatória.");
      return;
    }
    setSelecionadas((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <>
      <TabPageHead tab="historico">
        <div className="ga-relative">
          <button
            type="button"
            className="ga-btn ga-btn-secondary"
            onClick={() => setMenuAberto((open) => !open)}
            aria-expanded={menuAberto}
          >
            <Columns3 size={14} />
            Colunas · {visiveis.length}/{colunas.length}
            <ChevronDown size={12} />
          </button>
          {menuAberto && (
            <div className="ga-menu" style={{ left: 0, right: "auto", top: 46, width: 290 }}>
              <div className="ga-row-between" style={{ padding: "8px 10px 6px" }}>
                <span className="ga-overline">Colunas exibidas</span>
                <button
                  type="button"
                  className="ga-caption"
                  onClick={() => setMenuAberto(false)}
                  style={{ cursor: "pointer", background: "none", border: 0, color: "inherit" }}
                >
                  ok
                </button>
              </div>
              {colunas.map((c) => {
                const on = c.fixed || selecionadas[c.key];
                return (
                  <button
                    type="button"
                    key={c.key}
                    className="ga-menu-item ga-row"
                    onClick={() => alternarColuna(c.key, c.fixed)}
                    aria-pressed={on}
                  >
                    <span
                      className={`ga-checkbox${on ? " is-checked" : ""}`}
                      style={{ width: 15, height: 15 }}
                    >
                      <Check size={9} strokeWidth={3.6} />
                    </span>
                    <span className="ga-grow" style={{ textAlign: "left" }}>
                      {c.label}
                    </span>
                    {c.fixed && <span className="ga-caption ga-none">obrigatória</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </TabPageHead>

      <div className="ga-table-wrap" style={{ overflowX: "auto" }}>
        <table className="ga-table ga-table-zebra">
          <thead>
            <tr>
              {visiveis.map((c) => (
                <th key={c.key} style={{ width: c.width, whiteSpace: "nowrap" }}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => (
              <tr key={linha.key}>
                {linha.cells.map((cell) => (
                  <td
                    key={cell.key}
                    className={`${cell.mono ? "ga-mono " : ""}${cell.highlighted ? "ga-cell-old" : ""}`.trim()}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {cell.text}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {linhas.length === 0 && (
          <div className="ga-body-sm ga-muted" style={{ padding: "24px 20px 26px" }}>
            Nenhuma alteração cadastral nas colunas selecionadas.
          </div>
        )}
        <div className="ga-pagination">
          <span className="ga-pagination-info">
            {linhas.length} de {registros.length} registros com alteração
          </span>
          <div className="ga-row" style={{ gap: 16 }}>
            <span className="ga-row" style={{ gap: 7 }}>
              <span className="ga-legend-dot ga-legend-old" />
              <span className="ga-caption">valor anterior</span>
            </span>
            <span className="ga-row" style={{ gap: 7 }}>
              <span className="ga-legend-dot ga-legend-new" />
              <span className="ga-caption">valor novo</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
