"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Download, MoreVertical, Plus, Search } from "lucide-react";
import {
  ACTION_TYPE_LABEL,
  RULE_STATUS,
  SCHEMA_TARGET_LABEL,
  type FtmActionType,
  type FtmRule,
  type FtmRuleStatus,
  type FtmSchemaTarget,
} from "@/lib/mock/regras";
import { ROUTES, regraDetalhe } from "@/lib/routes";

const STATUS_TABS: Array<{ key: "todas" | FtmRuleStatus; label: string }> = [
  { key: "todas", label: "Todas" },
  { key: "RASCUNHO", label: RULE_STATUS.RASCUNHO.label },
  { key: "EM_TESTE", label: RULE_STATUS.EM_TESTE.label },
  { key: "ATIVA", label: RULE_STATUS.ATIVA.label },
  { key: "INATIVA", label: RULE_STATUS.INATIVA.label },
  { key: "ERRO", label: RULE_STATUS.ERRO.label },
  { key: "ARQUIVADA", label: RULE_STATUS.ARQUIVADA.label },
];

const SCHEMA_OPTIONS: FtmSchemaTarget[] = ["FiscalDocument", "Company", "TaxDeclaration", "EconomicEvent"];
const ACTION_OPTIONS: FtmActionType[] = Object.keys(ACTION_TYPE_LABEL) as FtmActionType[];

const BULK_ACTIONS: Array<{ status: FtmRuleStatus; label: string }> = [
  { status: "ATIVA", label: "Ativar" },
  { status: "INATIVA", label: "Desativar" },
  { status: "ARQUIVADA", label: "Arquivar" },
];

export function RegrasTable({ regras }: { regras: FtmRule[] }) {
  const [query, setQuery] = useState("");
  const [statusTab, setStatusTab] = useState<"todas" | FtmRuleStatus>("todas");
  const [schemaFilter, setSchemaFilter] = useState<"todos" | FtmSchemaTarget>("todos");
  const [actionFilter, setActionFilter] = useState<"todas" | FtmActionType>("todas");
  const [statusOverride, setStatusOverride] = useState<Record<string, FtmRuleStatus>>({});
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [menuId, setMenuId] = useState<string | null>(null);

  const statusOf = (r: FtmRule) => statusOverride[r.id] ?? r.status;

  const counts = useMemo(() => {
    const out: Record<string, number> = { todas: regras.length };
    for (const r of regras) {
      const s = statusOf(r);
      out[s] = (out[s] ?? 0) + 1;
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regras, statusOverride]);

  const alertas30d = useMemo(() => regras.reduce((sum, r) => sum + r.alertCount, 0), [regras]);

  const kpis = [
    { key: "ativas", label: "Regras ativas", value: counts.ATIVA ?? 0, delta: "em produção nos workers", cls: "ga-kpi-primary" },
    { key: "teste", label: "Em teste (dry-run)", value: counts.EM_TESTE ?? 0, delta: "backtest no Lakehouse", cls: "ga-kpi-warning" },
    { key: "rascunho", label: "Rascunhos", value: counts.RASCUNHO ?? 0, delta: "aguardando validação", cls: "ga-kpi-ink" },
    { key: "alertas", label: "Alertas 30 dias", value: alertas30d, delta: "deduplicados por hash", cls: "ga-kpi-success" },
  ];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return regras.filter((r) => {
      if (statusTab !== "todas" && statusOf(r) !== statusTab) return false;
      if (schemaFilter !== "todos" && r.schema !== schemaFilter) return false;
      if (actionFilter !== "todas" && !r.actionsSummary.includes(actionFilter)) return false;
      if (q && !`${r.code} ${r.name} ${r.schema}`.toLowerCase().includes(q)) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regras, query, statusTab, schemaFilter, actionFilter, statusOverride]);

  const selectedIds = Object.keys(selected).filter((id) => selected[id]);
  const allSelected = visible.length > 0 && visible.every((r) => selected[r.id]);

  function toggleAll() {
    const next = { ...selected };
    if (allSelected) {
      visible.forEach((r) => delete next[r.id]);
    } else {
      visible.forEach((r) => {
        next[r.id] = true;
      });
    }
    setSelected(next);
  }

  function toggleOne(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function applyStatus(ids: string[], status: FtmRuleStatus) {
    const next = { ...statusOverride };
    ids.forEach((id) => {
      next[id] = status;
    });
    setStatusOverride(next);
    setSelected({});
    setMenuId(null);
  }

  return (
    <div className="ga-col" style={{ gap: 18 }}>
      <div className="ga-page-head">
        <div className="ga-page-head-text">
          <div className="ga-breadcrumb">
            <span>Gestão de Alertas</span>
            <span>/</span>
            <span className="is-current">Regras</span>
          </div>
          <h1 className="ga-page-title">Regras de alerta</h1>
          <span className="ga-page-subtitle">
            Motor de regras FollowTheMoney · condições em AST versionada e ações disparadas por evento
          </span>
        </div>
        <div className="ga-page-actions">
          <div className="ga-search" style={{ width: 360 }}>
            <Search width={14} height={14} color="var(--ga-gray-400)" style={{ flex: "none" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por código, nome, schema ou ação"
              aria-label="Buscar regra"
            />
          </div>
          <button type="button" className="ga-btn ga-btn-secondary" disabled title="Exportação ainda não disponível">
            <Download size={14} />
            Exportar AST
          </button>
          <Link href={ROUTES.novaRegra} className="ga-btn ga-btn-primary">
            <Plus size={14} />
            Nova regra
          </Link>
        </div>
      </div>

      <div className="ga-kpi-grid" style={{ marginBottom: "var(--ga-space-5)" }}>
        {kpis.map((kpi) => (
          <div key={kpi.key} className={`ga-kpi ${kpi.cls}`}>
            <span className="ga-kpi-label">{kpi.label}</span>
            <span className="ga-kpi-value">{kpi.value}</span>
            <span className="ga-kpi-delta">{kpi.delta}</span>
          </div>
        ))}
      </div>

      <div className="ga-table-wrap">
        <div className="ga-table-toolbar">
          <div className="ga-tabs">
            {STATUS_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`ga-tab${statusTab === t.key ? " is-active" : ""}`}
                onClick={() => setStatusTab(t.key)}
              >
                {t.label}
                <span className="ga-tab-count">{counts[t.key] ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="ga-row" style={{ gap: 8 }}>
            {selectedIds.length > 0 && (
              <div
                className="ga-row"
                style={{ gap: 8, paddingRight: 10, borderRight: "1px solid var(--ga-border)" }}
              >
                <span className="ga-label">{selectedIds.length} selecionada(s)</span>
                {BULK_ACTIONS.map((b) => (
                  <button
                    key={b.status}
                    type="button"
                    className="ga-btn ga-btn-sm ga-btn-secondary"
                    onClick={() => applyStatus(selectedIds, b.status)}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            )}
            <select
              className="ga-select ga-select-sm"
              value={schemaFilter}
              onChange={(e) => setSchemaFilter(e.target.value as "todos" | FtmSchemaTarget)}
              aria-label="Filtrar por schema-alvo"
            >
              <option value="todos">Todos os schemas alvo</option>
              {SCHEMA_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {SCHEMA_TARGET_LABEL[s]}
                </option>
              ))}
            </select>
            <select
              className="ga-select ga-select-sm"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value as "todas" | FtmActionType)}
              aria-label="Filtrar por ação disparada"
            >
              <option value="todas">Todos os canais / ações</option>
              {ACTION_OPTIONS.map((a) => (
                <option key={a} value={a}>
                  {ACTION_TYPE_LABEL[a].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="ga-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <button
                  type="button"
                  className={`ga-checkbox${allSelected ? " is-checked" : ""}`}
                  style={{ width: 15, height: 15 }}
                  aria-label="Selecionar todas as regras visíveis"
                  aria-pressed={allSelected}
                  onClick={toggleAll}
                >
                  <Check size={9} strokeWidth={3.6} />
                </button>
              </th>
              <th style={{ width: 120 }}>Código</th>
              <th>Nome</th>
              <th style={{ width: 190 }}>Schema-alvo</th>
              <th style={{ width: 90 }}>Prioridade</th>
              <th style={{ width: 130 }}>Situação</th>
              <th style={{ width: 90 }}>Condições</th>
              <th style={{ width: 220 }}>Ações</th>
              <th style={{ width: 90, textAlign: "right" }}>Alertas</th>
              <th style={{ width: 56 }}></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => {
              const status = statusOf(r);
              const meta = RULE_STATUS[status];
              return (
                <tr key={r.id}>
                  <td>
                    <button
                      type="button"
                      className={`ga-checkbox${selected[r.id] ? " is-checked" : ""}`}
                      style={{ width: 15, height: 15 }}
                      aria-label={`Selecionar ${r.code}`}
                      aria-pressed={!!selected[r.id]}
                      onClick={() => toggleOne(r.id)}
                    >
                      <Check size={9} strokeWidth={3.6} />
                    </button>
                  </td>
                  <td>
                    <Link href={regraDetalhe(r.code)} className="ga-mono" style={{ fontWeight: 500 }}>
                      {r.code}
                    </Link>
                  </td>
                  <td>
                    <Link href={regraDetalhe(r.code)} className="ga-stack-2" style={{ gap: 2, minWidth: 0 }}>
                      <span className="ga-cell-primary ga-truncate">{r.name}</span>
                      <span className="ga-cell-meta ga-truncate">{r.desc}</span>
                    </Link>
                  </td>
                  <td>{SCHEMA_TARGET_LABEL[r.schema]}</td>
                  <td className="ga-table-num">{r.priority}</td>
                  <td>
                    <span className={`ga-badge ${meta.cls}`}>{meta.label}</span>
                  </td>
                  <td className="ga-table-num">{r.conditionCount}</td>
                  <td>
                    <div className="ga-row ga-wrap" style={{ gap: 6 }}>
                      {r.actionsSummary.map((a) => (
                        <span key={a} className={`ga-chip ${ACTION_TYPE_LABEL[a].cls}`}>
                          {ACTION_TYPE_LABEL[a].label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="ga-table-num">{r.alertCount}</td>
                  <td className="ga-relative">
                    <button
                      type="button"
                      className="ga-row-menu-btn"
                      aria-expanded={menuId === r.id}
                      aria-label="Mais ações"
                      onClick={() => setMenuId(menuId === r.id ? null : r.id)}
                    >
                      <MoreVertical size={16} />
                    </button>
                    {menuId === r.id && (
                      <div className="ga-menu" style={{ right: 20, width: 252 }}>
                        <Link href={regraDetalhe(r.code)} className="ga-menu-item" onClick={() => setMenuId(null)}>
                          Editar regra
                        </Link>
                        <Link href={regraDetalhe(r.code)} className="ga-menu-item" onClick={() => setMenuId(null)}>
                          Ver condições
                        </Link>
                        <button type="button" className="ga-menu-item" disabled title="Ainda não disponível">
                          Listar OS de intervenção
                        </button>
                        <button type="button" className="ga-menu-item" disabled title="Ainda não disponível">
                          Solicitar OS
                        </button>
                        <button type="button" className="ga-menu-item" disabled title="Ainda não disponível">
                          Delegar
                        </button>
                        <div className="ga-menu-divider" />
                        <button type="button" className="ga-menu-item" disabled title="Ainda não disponível">
                          Duplicar como rascunho
                        </button>
                        <button type="button" className="ga-menu-item" disabled title="Ainda não disponível">
                          Executar backtest 90 dias
                        </button>
                        <div className="ga-menu-divider" />
                        <button
                          type="button"
                          className="ga-menu-item is-success"
                          onClick={() => applyStatus([r.id], "ATIVA")}
                        >
                          Ativar em produção
                        </button>
                        <button type="button" className="ga-menu-item" onClick={() => applyStatus([r.id], "INATIVA")}>
                          Suspender
                        </button>
                        <button
                          type="button"
                          className="ga-menu-item is-danger"
                          onClick={() => applyStatus([r.id], "ARQUIVADA")}
                        >
                          Arquivar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={10} className="ga-body-sm ga-muted" style={{ padding: "18px 12px" }}>
                  Nenhuma regra encontrada para os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
