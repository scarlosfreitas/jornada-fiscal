"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MoreVertical, Plus, Search, Upload } from "lucide-react";
import { LIST_STATUS_LABEL, OBSERVABLES, type FtmList, type FtmListStatus } from "@/lib/mock/listas";
import { ROUTES, listaDetalhe } from "@/lib/routes";

export function ListasTable({ listas }: { listas: FtmList[] }) {
  const [query, setQuery] = useState("");
  const [statusOverride, setStatusOverride] = useState<Record<number, FtmListStatus>>({});
  const [menuId, setMenuId] = useState<number | null>(null);

  const statusOf = (l: FtmList) => statusOverride[l.id] ?? l.status;

  const kpis = useMemo(() => {
    const listasAtivas = listas.filter((l) => statusOf(l) === "ATIVA").length;
    const itensVigentes = listas.reduce((sum, l) => sum + l.items.filter((i) => !i.validTo).length, 0);
    const encerrados90d = listas.reduce((sum, l) => sum + l.items.filter((i) => i.validTo).length, 0);
    const regrasConsumidoras = listas.reduce((sum, l) => sum + l.consumers.length, 0);
    return [
      { key: "listas", label: "Listas ativas", value: listasAtivas, delta: "em Redis Sets", cls: "ga-kpi-primary" },
      { key: "vigentes", label: "Itens vigentes", value: itensVigentes, delta: "valid_to IS NULL", cls: "ga-kpi-ink" },
      { key: "encerrados", label: "Encerrados 90d", value: encerrados90d, delta: "vigência finalizada", cls: "ga-kpi-warning" },
      { key: "regras", label: "Regras consumidoras", value: regrasConsumidoras, delta: "operadores IN_LIST / NOT_IN_LIST", cls: "ga-kpi-success" },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listas, statusOverride]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listas;
    return listas.filter((l) => {
      const observable = OBSERVABLES.find((o) => o.id === l.observableId);
      return `${l.code} ${l.name} ${observable?.label ?? ""}`.toLowerCase().includes(q);
    });
  }, [listas, query]);

  function archive(id: number) {
    setStatusOverride((prev) => ({ ...prev, [id]: "ARQUIVADA" }));
    setMenuId(null);
  }

  return (
    <div className="ga-col" style={{ gap: 18 }}>
      <div className="ga-page-head">
        <div className="ga-page-head-text">
          <div className="ga-breadcrumb">
            <span>Gestão de Alertas</span>
            <span>/</span>
            <span className="is-current">Listas</span>
          </div>
          <h1 className="ga-page-title">Listas de observáveis</h1>
          <span className="ga-page-subtitle">
            Watchlists com vigência temporal (SCD tipo 2) · carregadas em Redis Sets para cruzamento IN_LIST em tempo real
          </span>
        </div>
        <div className="ga-page-actions">
          <div className="ga-search" style={{ width: 340 }}>
            <Search width={14} height={14} color="var(--ga-gray-400)" style={{ flex: "none" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por código, nome ou observável"
              aria-label="Buscar lista"
            />
          </div>
          <button type="button" className="ga-btn ga-btn-secondary" disabled title="Importação ainda não disponível">
            <Upload size={14} />
            Importar CSV
          </button>
          <Link href={ROUTES.novaLista} className="ga-btn ga-btn-primary">
            <Plus size={14} />
            Nova lista
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
        <table className="ga-table">
          <thead>
            <tr>
              <th style={{ width: 260 }}>Código</th>
              <th>Nome</th>
              <th style={{ width: 220 }}>Observável</th>
              <th style={{ width: 120 }}>Situação</th>
              <th style={{ width: 100, textAlign: "right" }}>Ativos</th>
              <th style={{ width: 110, textAlign: "right" }}>Encerrados</th>
              <th style={{ width: 100, textAlign: "right" }}>Regras</th>
              <th style={{ width: 56 }}></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((l) => {
              const status = LIST_STATUS_LABEL[statusOf(l)];
              const observable = OBSERVABLES.find((o) => o.id === l.observableId);
              const active = l.items.filter((i) => !i.validTo).length;
              const closed = l.items.filter((i) => i.validTo).length;
              return (
                <tr key={l.id}>
                  <td>
                    <Link href={listaDetalhe(l.code)} className="ga-mono" style={{ fontWeight: 500 }}>
                      {l.code}
                    </Link>
                  </td>
                  <td>
                    <Link href={listaDetalhe(l.code)} className="ga-stack-2" style={{ gap: 2, minWidth: 0 }}>
                      <span className="ga-cell-primary ga-truncate">{l.name}</span>
                      <span className="ga-cell-meta ga-truncate">{l.desc}</span>
                    </Link>
                  </td>
                  <td>{observable?.label}</td>
                  <td>
                    <span className={`ga-badge ${status.cls}`}>{status.label}</span>
                  </td>
                  <td className="ga-table-num">{active}</td>
                  <td className="ga-table-num">{closed}</td>
                  <td className="ga-table-num">{l.consumers.length}</td>
                  <td className="ga-relative">
                    <button
                      type="button"
                      className="ga-row-menu-btn"
                      aria-expanded={menuId === l.id}
                      aria-label="Mais ações"
                      onClick={() => setMenuId(menuId === l.id ? null : l.id)}
                    >
                      <MoreVertical size={16} />
                    </button>
                    {menuId === l.id && (
                      <div className="ga-menu" style={{ right: 20, width: 240 }}>
                        <Link href={listaDetalhe(l.code)} className="ga-menu-item" onClick={() => setMenuId(null)}>
                          Editar lista e itens
                        </Link>
                        <button type="button" className="ga-menu-item" disabled title="Ainda não disponível">
                          Exportar itens vigentes
                        </button>
                        <button type="button" className="ga-menu-item" disabled title="Ainda não disponível">
                          Recarregar no Redis
                        </button>
                        <div className="ga-menu-divider" />
                        <button type="button" className="ga-menu-item is-danger" onClick={() => archive(l.id)}>
                          Arquivar lista
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="ga-body-sm ga-muted" style={{ padding: "18px 12px" }}>
                  Nenhuma lista encontrada para a busca.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
