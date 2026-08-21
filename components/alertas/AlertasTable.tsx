"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MoreVertical, Search } from "lucide-react";
import {
  ALERT_CHANNEL_LABEL,
  ALERT_CHANNEL_ORDER,
  ALERT_LEVEL_LABEL,
  ALERT_TARGET_LABEL,
  type AlertChannel,
  type AlertLevel,
  type AlertTargetKind,
  type GeneratedAlert,
} from "@/lib/mock/alertas";
import { regraDetalhe } from "@/lib/routes";

const LEVEL_TABS: Array<{ key: "todos" | AlertLevel; label: string }> = [
  { key: "todos", label: "Todos" },
  { key: "amarelo", label: ALERT_LEVEL_LABEL.amarelo.label },
  { key: "vermelho", label: ALERT_LEVEL_LABEL.vermelho.label },
  { key: "cinza", label: ALERT_LEVEL_LABEL.cinza.label },
];

const TARGET_OPTIONS: AlertTargetKind[] = ["cnpj", "grupo", "socio"];
const TARGET_LABEL: Record<AlertTargetKind, string> = { cnpj: "CNPJ", grupo: "Grupo econômico", socio: "Sócio" };

const PAGE_SIZES = [10, 25, 50];

export function AlertasTable({ alertas }: { alertas: GeneratedAlert[] }) {
  const [query, setQuery] = useState("");
  const [levelTab, setLevelTab] = useState<"todos" | AlertLevel>("todos");
  const [channelFilter, setChannelFilter] = useState<"todos" | AlertChannel>("todos");
  const [targetFilter, setTargetFilter] = useState<"todos" | AlertTargetKind>("todos");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [menuId, setMenuId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const out: Record<string, number> = { todos: alertas.length };
    for (const a of alertas) out[a.level] = (out[a.level] ?? 0) + 1;
    return out;
  }, [alertas]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return alertas.filter((a) => {
      if (levelTab !== "todos" && a.level !== levelTab) return false;
      if (channelFilter !== "todos" && !a.channels.includes(channelFilter)) return false;
      if (targetFilter !== "todos" && a.targetKind !== targetFilter) return false;
      if (q && !`${a.ruleCode} ${a.name} ${a.doc}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [alertas, query, levelTab, channelFilter, targetFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  function changePageSize(size: number) {
    setPageSize(size);
    setPage(1);
  }

  return (
    <div className="ga-col" style={{ gap: 18 }}>
      <div className="ga-row ga-wrap" style={{ gap: 12 }}>
        <div className="ga-search" style={{ width: 340 }}>
          <Search width={14} height={14} color="var(--ga-gray-400)" style={{ flex: "none" }} />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por regra, alvo ou documento"
            aria-label="Buscar alerta"
          />
        </div>
        <select
          className="ga-select"
          style={{ width: 220 }}
          value={channelFilter}
          onChange={(e) => {
            setChannelFilter(e.target.value as "todos" | AlertChannel);
            setPage(1);
          }}
          aria-label="Filtrar por canal"
        >
          <option value="todos">Todos os canais</option>
          {ALERT_CHANNEL_ORDER.map((c) => (
            <option key={c} value={c}>
              {ALERT_CHANNEL_LABEL[c].label}
            </option>
          ))}
        </select>
        <select
          className="ga-select"
          style={{ width: 190 }}
          value={targetFilter}
          onChange={(e) => {
            setTargetFilter(e.target.value as "todos" | AlertTargetKind);
            setPage(1);
          }}
          aria-label="Filtrar por tipo de alvo"
        >
          <option value="todos">Todos os alvos</option>
          {TARGET_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {TARGET_LABEL[t]}
            </option>
          ))}
        </select>
      </div>

      <div className="ga-table-wrap">
        <div className="ga-table-toolbar">
          <div className="ga-tabs">
            {LEVEL_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`ga-tab${levelTab === t.key ? " is-active" : ""}`}
                onClick={() => {
                  setLevelTab(t.key);
                  setPage(1);
                }}
              >
                {t.label}
                <span className="ga-tab-count">{counts[t.key] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        <table className="ga-table">
          <thead>
            <tr>
              <th style={{ width: 150 }}>Data</th>
              <th style={{ width: 230 }}>Tipo de alerta</th>
              <th style={{ width: 148 }}>Regra de alerta</th>
              <th style={{ width: 240 }}>Canal de comunicação</th>
              <th>Alvo</th>
              <th style={{ width: 56 }}></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((a) => {
              const level = ALERT_LEVEL_LABEL[a.level];
              const target = ALERT_TARGET_LABEL[a.targetKind];
              return (
                <tr key={a.id}>
                  <td>
                    <span className="ga-stack-2" style={{ gap: 2 }}>
                      <span className="ga-mono" style={{ fontWeight: 500, color: "var(--ga-gray-700)" }}>
                        {a.date}
                      </span>
                      <span className="ga-caption ga-mono">{a.time}</span>
                    </span>
                  </td>
                  <td>
                    <span className={`ga-level ${level.cls}`}>{level.label}</span>
                  </td>
                  <td>
                    <Link href={regraDetalhe(a.ruleCode)} className="ga-mono" style={{ fontWeight: 500 }}>
                      {a.ruleCode}
                    </Link>
                  </td>
                  <td>
                    <div className="ga-row ga-wrap" style={{ gap: 6 }}>
                      {a.channels.map((ch) => (
                        <span key={ch} className={`ga-chip ${ALERT_CHANNEL_LABEL[ch].cls}`}>
                          {ALERT_CHANNEL_LABEL[ch].label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="ga-row" style={{ gap: 10 }}>
                      <span
                        className={`ga-chip ${target.cls} ga-mono`}
                        style={{ width: 34, height: 30, justifyContent: "center", fontSize: 10, fontWeight: 600 }}
                      >
                        {target.tag}
                      </span>
                      <span className="ga-stack-2" style={{ gap: 2, minWidth: 0 }}>
                        <span className="ga-cell-primary ga-truncate">{a.name}</span>
                        <span className="ga-cell-meta ga-truncate">{a.doc}</span>
                      </span>
                    </div>
                  </td>
                  <td className="ga-relative">
                    <button
                      type="button"
                      className="ga-row-menu-btn"
                      aria-expanded={menuId === a.id}
                      onClick={() => setMenuId(menuId === a.id ? null : a.id)}
                      aria-label="Mais ações"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {menuId === a.id && (
                      <div className="ga-menu" style={{ right: 20, width: 246 }}>
                        <Link href={regraDetalhe(a.ruleCode)} className="ga-menu-item" onClick={() => setMenuId(null)}>
                          Ver regra de origem
                        </Link>
                        <button type="button" className="ga-menu-item" disabled title="Sem tela de detalhe de alerta">
                          Ver detalhe do alerta
                        </button>
                        <button type="button" className="ga-menu-item" disabled title="Ainda não disponível">
                          Abrir histórico do contribuinte
                        </button>
                        <div className="ga-menu-divider" />
                        <button type="button" className="ga-menu-item" disabled title="Ainda não disponível">
                          Reenviar pelo canal
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={6} className="ga-body-sm ga-muted" style={{ padding: "18px 12px" }}>
                  Nenhum alerta encontrado para os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="ga-pagination">
          <div className="ga-row" style={{ gap: 14 }}>
            <span className="ga-pagination-info">
              Mostrando <strong>{filtered.length === 0 ? 0 : start + 1}–{Math.min(start + pageSize, filtered.length)}</strong> de{" "}
              <strong>{filtered.length}</strong> itens
            </span>
            <div className="ga-row" style={{ gap: 8 }}>
              <span className="ga-pagination-info">Itens por página</span>
              <select
                className="ga-select ga-select-sm ga-mono"
                style={{ height: 32 }}
                value={pageSize}
                onChange={(e) => changePageSize(Number(e.target.value))}
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="ga-pagination-pages">
            <button
              type="button"
              className="ga-page-btn"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={`ga-page-btn${p === currentPage ? " is-active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              className="ga-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
