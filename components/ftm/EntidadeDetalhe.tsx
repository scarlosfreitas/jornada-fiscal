"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ancestorsOf,
  FTM_STATUS_LABEL,
  inheritedPropertiesOf,
  INGESTION_TOPICS,
  ownPropertiesOf,
  PROPERTY_TYPES,
  RULE_BADGE,
  schemaById,
  TARGET_RULES,
  type FtmProperty,
  type FtmSchema,
  type FtmStatus,
} from "@/lib/mock/ftm";
import { ROUTES } from "@/lib/routes";
import { Switch } from "./Switch";

const STATUS_OPTIONS: FtmStatus[] = ["EM_TESTE", "ATIVA", "SUSPENSA", "ARQUIVADA"];

export function EntidadeDetalhe({
  schema,
  allSchemas,
  properties,
  onPropertiesChange,
  onBack,
}: {
  schema: FtmSchema;
  allSchemas: FtmSchema[];
  properties: FtmProperty[];
  onPropertiesChange: (properties: FtmProperty[]) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState(schema.name);
  const [label, setLabel] = useState(schema.label);
  const [desc, setDesc] = useState(schema.desc);
  const [parentId, setParentId] = useState<number | null>(schema.parent);
  const [edge, setEdge] = useState(schema.edge);

  const own = ownPropertiesOf(properties, schema.id);
  const inherited = inheritedPropertiesOf(properties, schema.id);
  const chain = useMemo(() => [name, ...ancestorsOf(schema.id).map((a) => a.name)].join(" → "), [name, schema.id]);
  const targetRules = TARGET_RULES[schema.id] ?? [];
  const ingestion = INGESTION_TOPICS[schema.id];

  const parentOptions = allSchemas.filter((s) => s.id !== schema.id);

  function toggleObservable(propertyId: number) {
    onPropertiesChange(
      properties.map((p) => (p.id === propertyId ? { ...p, observable: !p.observable } : p)),
    );
  }

  function changeStatus(propertyId: number, status: FtmStatus) {
    const prop = properties.find((p) => p.id === propertyId);
    onPropertiesChange(properties.map((p) => (p.id === propertyId ? { ...p, status } : p)));
    if (prop) toast(`${prop.name} → ${FTM_STATUS_LABEL[status].label}.`);
  }

  function handleSave() {
    toast(`${name} salvo · ${own.length} propriedades próprias.`);
  }

  const statusBreakdown = STATUS_OPTIONS.map((status) => ({
    status,
    ...FTM_STATUS_LABEL[status],
    count: own.filter((p) => p.status === status).length,
  }));

  return (
    <div className="ga-col" style={{ gap: 18 }}>
      <div className="ga-page-head">
        <div className="ga-page-head-text">
          <div className="ga-breadcrumb">
            <button
              type="button"
              onClick={onBack}
              style={{ background: "none", border: "none", padding: 0, font: "inherit", color: "inherit", cursor: "pointer" }}
            >
              Ontologia FtM / Entidades
            </button>
            <span>/</span>
            <span className="is-current">{label}</span>
          </div>
          <h1 className="ga-page-title">{label}</h1>
          <div className="ga-row ga-wrap" style={{ gap: 8, marginTop: 4 }}>
            <span className="ga-chip ga-chip-primary ga-mono">{name}</span>
            <span className={`ga-chip ${edge ? "ga-chip-warning" : "ga-chip-primary"}`}>
              {edge ? "aresta com vigência" : "entidade"}
            </span>
            <span className="ga-chip">{chain}</span>
          </div>
        </div>
        <div className="ga-page-actions">
          <button type="button" className="ga-btn ga-btn-secondary" onClick={onBack}>
            Voltar
          </button>
          <button type="button" className="ga-btn ga-btn-primary" onClick={handleSave}>
            Salvar entidade
          </button>
        </div>
      </div>

      <div className="ga-grid-detail" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 18 }}>
        <div className="ga-col" style={{ gap: 18 }}>
          <div className="ga-card">
            <div className="ga-card-head">
              <span className="ga-card-title">Definição do schema</span>
            </div>
            <div className="ga-card-body" style={{ padding: "16px 20px" }}>
              <div className="ga-form-grid">
                <div className="ga-field" style={{ minWidth: 0 }}>
                  <label className="ga-label">Nome técnico</label>
                  <input className="ga-input ga-input-mono" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="ga-field" style={{ minWidth: 0 }}>
                  <label className="ga-label">Rótulo na interface</label>
                  <input className="ga-input" value={label} onChange={(e) => setLabel(e.target.value)} />
                </div>
                <div className="ga-field" style={{ minWidth: 0 }}>
                  <label className="ga-label">Schema pai</label>
                  <select
                    className="ga-select"
                    value={parentId ?? ""}
                    onChange={(e) => setParentId(e.target.value === "" ? null : Number(e.target.value))}
                  >
                    <option value="">— (schema raiz)</option>
                    {parentOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ga-field" style={{ minWidth: 0 }}>
                  <label className="ga-label">Natureza</label>
                  <div className="ga-row" style={{ gap: 10 }}>
                    <Switch on={edge} onToggle={() => setEdge((v) => !v)} label="Alternar natureza (aresta com vigência)" />
                    <span className="ga-body-sm ga-muted">
                      {edge
                        ? "Aresta — relacionamento com startDate / endDate (SCD tipo 2)"
                        : "Entidade — objeto do grafo, sem vigência própria"}
                    </span>
                  </div>
                </div>
                <div className="ga-field ga-col-span-2" style={{ minWidth: 0 }}>
                  <label className="ga-label">Descrição semântica</label>
                  <textarea className="ga-textarea" value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
                </div>
              </div>
            </div>
          </div>

          <div className="ga-card">
            <div className="ga-card-head">
              <span className="ga-card-title">Propriedades próprias</span>
              <Link href={ROUTES.ftmPropriedades} className="ga-btn ga-btn-sm ga-btn-secondary">
                Cadastrar propriedade
              </Link>
            </div>
            <table className="ga-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Rótulo</th>
                  <th style={{ width: 130 }}>Tipo</th>
                  <th style={{ width: 130 }}>Aponta para</th>
                  <th style={{ width: 80 }}>Múltipla</th>
                  <th style={{ width: 90 }}>Observável</th>
                  <th style={{ width: 140 }}>Situação</th>
                </tr>
              </thead>
              <tbody>
                {own.map((p) => {
                  const typeMeta = PROPERTY_TYPES[p.typeId];
                  const target = p.targetSchemaId ? schemaById(p.targetSchemaId) : undefined;
                  const dim = p.status === "SUSPENSA" || p.status === "ARQUIVADA";
                  return (
                    <tr key={p.id}>
                      <td className="ga-mono" style={{ color: dim ? "var(--ga-gray-400)" : "var(--ga-gray-900)" }}>
                        {p.name}
                      </td>
                      <td>{p.label}</td>
                      <td className="ga-body-sm">{typeMeta.name}</td>
                      <td className="ga-body-sm">{target ? target.name : "—"}</td>
                      <td>{p.multi ? "sim" : "—"}</td>
                      <td>
                        <Switch on={p.observable} onToggle={() => toggleObservable(p.id)} label={`Observável de ${p.name}`} />
                      </td>
                      <td>
                        <select
                          className="ga-select ga-select-sm"
                          value={p.status}
                          onChange={(e) => changeStatus(p.id, e.target.value as FtmStatus)}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {FTM_STATUS_LABEL[s].label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {own.length === 0 && (
                  <tr>
                    <td colSpan={7} className="ga-body-sm ga-muted" style={{ padding: "14px 12px" }}>
                      Este schema não declara propriedades próprias.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="ga-card-foot ga-body-sm ga-muted">
              {own.length} próprias · {own.filter((p) => p.observable).length} observáveis
            </div>
          </div>

          {inherited.length > 0 && (
            <div className="ga-card">
              <div className="ga-card-head">
                <span className="ga-card-title">Propriedades herdadas</span>
              </div>
              <table className="ga-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Rótulo</th>
                    <th style={{ width: 150 }}>Origem</th>
                    <th style={{ width: 130 }}>Tipo</th>
                    <th style={{ width: 90 }}>Observável</th>
                    <th style={{ width: 130 }}>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {inherited.map((p) => (
                    <tr key={p.id}>
                      <td className="ga-mono">{p.name}</td>
                      <td>{p.label}</td>
                      <td className="ga-mono ga-body-sm">{p.originSchemaName}</td>
                      <td className="ga-body-sm">{PROPERTY_TYPES[p.typeId].name}</td>
                      <td>{p.observable ? "sim" : "—"}</td>
                      <td>
                        <span className={`ga-badge ${FTM_STATUS_LABEL[p.status].cls}`}>
                          {FTM_STATUS_LABEL[p.status].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="ga-col" style={{ gap: 18 }}>
          <div className="ga-card">
            <div className="ga-card-head">
              <span className="ga-card-title">Situação das propriedades</span>
            </div>
            <div className="ga-card-body" style={{ padding: "12px 20px", gap: 10 }}>
              {statusBreakdown.map((s) => (
                <div key={s.status} className="ga-row-between">
                  <span className={`ga-badge ${s.cls}`}>{s.label}</span>
                  <span className="ga-mono ga-body-sm">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ga-card">
            <div className="ga-card-head">
              <span className="ga-card-title">Dados de ingestão</span>
            </div>
            <div className="ga-card-body" style={{ padding: "12px 20px", gap: 10 }}>
              <div className="ga-row-between">
                <span className="ga-label">Tópico</span>
                <span className="ga-mono ga-body-sm">{ingestion ? ingestion.topic : "—"}</span>
              </div>
              <div className="ga-row-between">
                <span className="ga-label">Chave de partição</span>
                <span className="ga-mono ga-body-sm">{ingestion ? ingestion.partitionKey : "—"}</span>
              </div>
              <div className="ga-row-between">
                <span className="ga-label">Contrato</span>
                <span className="ga-body-sm">{ingestion ? "Avro · Schema Registry" : "—"}</span>
              </div>
              <div className="ga-row-between">
                <span className="ga-label">Enriquecimento</span>
                <span className="ga-body-sm">{ingestion ? "Stream processor (Flink)" : "—"}</span>
              </div>
            </div>
          </div>

          <div className="ga-card">
            <div className="ga-card-head">
              <span className="ga-card-title">Regras alvo</span>
            </div>
            <div className="ga-card-body" style={{ padding: "12px 20px", gap: 8 }}>
              {targetRules.length === 0 && (
                <span className="ga-body-sm ga-muted">Nenhuma regra usa esse schema como evento disparador.</span>
              )}
              {targetRules.map((r) => (
                <div key={r.code} className="ga-row-between">
                  <span className="ga-mono ga-body-sm">{r.code}</span>
                  <span className={`ga-badge ${RULE_BADGE[r.status]?.cls ?? "ga-badge-neutral"}`}>
                    {RULE_BADGE[r.status]?.label ?? r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
