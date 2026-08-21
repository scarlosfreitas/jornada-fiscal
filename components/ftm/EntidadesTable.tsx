"use client";

import { useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import {
  ancestorsOf,
  depthOf,
  ownPropertiesOf,
  schemaById,
  TARGET_RULES,
  type FtmProperty,
  type FtmSchema,
} from "@/lib/mock/ftm";
import { ROUTES } from "@/lib/routes";
import { RowMenu } from "./RowMenu";

type NatureTab = "todos" | "ent" | "edge";

export function EntidadesTable({
  schemas,
  properties,
  query,
  onQuery,
  tab,
  onTab,
  menuId,
  onMenuChange,
  onOpenDetail,
}: {
  schemas: FtmSchema[];
  properties: FtmProperty[];
  query: string;
  onQuery: (q: string) => void;
  tab: NatureTab;
  onTab: (tab: NatureTab) => void;
  menuId: number | null;
  onMenuChange: (id: number | null) => void;
  onOpenDetail: (schemaId: number) => void;
}) {
  const kpis = useMemo(
    () => ({
      entidades: schemas.filter((s) => !s.edge).length,
      arestas: schemas.filter((s) => s.edge).length,
      propsAtivas: properties.filter((p) => p.status === "ATIVA").length,
      observaveis: properties.filter((p) => p.observable).length,
    }),
    [schemas, properties],
  );

  const tabs: Array<{ key: NatureTab; label: string; count: number }> = [
    { key: "todos", label: "Todos os schemas", count: schemas.length },
    { key: "ent", label: "Entidades", count: schemas.filter((s) => !s.edge).length },
    { key: "edge", label: "Arestas (vigência)", count: schemas.filter((s) => s.edge).length },
  ];

  const q = query.trim().toLowerCase();
  const suppressIndent = !!q || tab !== "todos";

  const visible = schemas.filter((s) => {
    if (tab === "ent" && s.edge) return false;
    if (tab === "edge" && !s.edge) return false;
    if (!q) return true;
    return [s.name, s.label, s.desc].join(" ").toLowerCase().includes(q);
  });

  return (
    <div className="ga-col" style={{ gap: 18 }}>
      <div className="ga-page-head">
        <div className="ga-page-head-text">
          <div className="ga-breadcrumb">
            <span>Ontologia FtM</span>
            <span>/</span>
            <span className="is-current">Entidades</span>
          </div>
          <h1 className="ga-page-title">Entidades</h1>
          <span className="ga-page-subtitle">
            Catálogo de schemas FtM · hierarquia de herança e propriedades disponíveis para regras
          </span>
        </div>
        <div className="ga-page-actions">
          <div className="ga-search" style={{ width: 320 }}>
            <Search width={14} height={14} color="var(--ga-gray-400)" style={{ flex: "none" }} />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Buscar por nome técnico, rótulo ou descrição"
              aria-label="Buscar schema"
            />
          </div>
        </div>
      </div>

      <div className="ga-kpi-grid" style={{ marginBottom: "var(--ga-space-5)" }}>
        <div className="ga-kpi ga-kpi-primary">
          <span className="ga-kpi-label">Entidades</span>
          <span className="ga-kpi-value">{kpis.entidades}</span>
        </div>
        <div className="ga-kpi ga-kpi-warning">
          <span className="ga-kpi-label">Arestas com vigência</span>
          <span className="ga-kpi-value">{kpis.arestas}</span>
        </div>
        <div className="ga-kpi ga-kpi-success">
          <span className="ga-kpi-label">Propriedades ativas</span>
          <span className="ga-kpi-value">{kpis.propsAtivas}</span>
        </div>
        <div className="ga-kpi ga-kpi-ink">
          <span className="ga-kpi-label">Observáveis</span>
          <span className="ga-kpi-value">{kpis.observaveis}</span>
        </div>
      </div>

      <div className="ga-table-wrap">
        <div className="ga-table-toolbar">
          <div className="ga-tabs">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`ga-tab${tab === t.key ? " is-active" : ""}`}
                onClick={() => onTab(t.key)}
              >
                {t.label}
                <span className="ga-tab-count">{t.count}</span>
              </button>
            ))}
          </div>
        </div>

        <table className="ga-table">
          <thead>
            <tr>
              <th>Schema</th>
              <th>Descrição semântica</th>
              <th style={{ width: 160 }}>Herda de</th>
              <th style={{ width: 110 }}>Natureza</th>
              <th style={{ width: 90, textAlign: "right" }}>Próprias</th>
              <th style={{ width: 90, textAlign: "right" }}>Herdadas</th>
              <th style={{ width: 100, textAlign: "right" }}>Observáveis</th>
              <th style={{ width: 100, textAlign: "right" }}>Regras alvo</th>
              <th style={{ width: 56 }}></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => {
              const own = ownPropertiesOf(properties, s.id);
              const inheritedCount = ancestorsOf(s.id).reduce(
                (sum, a) => sum + ownPropertiesOf(properties, a.id).length,
                0,
              );
              const parent = s.parent ? schemaById(s.parent) : undefined;
              const targetRules = TARGET_RULES[s.id] ?? [];
              const indent = suppressIndent ? 0 : depthOf(s.id) * 20;

              return (
                <tr key={s.id}>
                  <td style={{ paddingLeft: 12 + indent }}>
                    <span className="ga-stack-2" style={{ gap: 2 }}>
                      <span className="ga-cell-primary ga-mono">{s.name}</span>
                      <span className="ga-cell-meta">{s.label}</span>
                    </span>
                  </td>
                  <td className="ga-body-sm">{s.desc}</td>
                  <td className="ga-mono ga-body-sm">{parent ? parent.name : "—"}</td>
                  <td>
                    <span className={`ga-chip ${s.edge ? "ga-chip-warning" : "ga-chip-primary"}`}>
                      {s.edge ? "aresta" : "entidade"}
                    </span>
                  </td>
                  <td className="ga-table-num">{own.length}</td>
                  <td className="ga-table-num">{inheritedCount}</td>
                  <td className="ga-table-num">{own.filter((p) => p.observable).length}</td>
                  <td className="ga-table-num">{targetRules.length || "—"}</td>
                  <td className="ga-relative">
                    <RowMenu open={menuId === s.id} onOpenChange={(open) => onMenuChange(open ? s.id : null)}>
                      <button
                        type="button"
                        className="ga-menu-item"
                        onClick={() => {
                          onMenuChange(null);
                          onOpenDetail(s.id);
                        }}
                      >
                        Editar entidade e propriedades
                      </button>
                      <Link href={ROUTES.ftmPropriedades} className="ga-menu-item" onClick={() => onMenuChange(null)}>
                        Cadastrar propriedade
                      </Link>
                      <button
                        type="button"
                        className="ga-menu-item"
                        onClick={() => {
                          onMenuChange(null);
                          toast(`Contrato Avro de ${s.name} publicado no Schema Registry.`);
                        }}
                      >
                        Ver contrato Avro do tópico
                      </button>
                    </RowMenu>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={9} className="ga-body-sm ga-muted" style={{ padding: "18px 12px" }}>
                  Nenhum schema encontrado para os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
