"use client";

import { RULE_STATUS, SCHEMA_TARGET_LABEL, type FtmRuleStatus, type FtmSchemaTarget } from "@/lib/mock/regras";

export interface RegraForm {
  code: string;
  name: string;
  desc: string;
  schema: FtmSchemaTarget;
  priority: string;
  status: FtmRuleStatus;
}

const SCHEMA_OPTIONS: FtmSchemaTarget[] = ["FiscalDocument", "Company", "TaxDeclaration", "EconomicEvent"];
const STATUS_OPTIONS = Object.keys(RULE_STATUS) as FtmRuleStatus[];

export function RegraIdentificacao({
  form,
  onChange,
}: {
  form: RegraForm;
  onChange: (form: RegraForm) => void;
}) {
  const set = <K extends keyof RegraForm>(key: K, value: RegraForm[K]) => onChange({ ...form, [key]: value });

  return (
    <div className="ga-card">
      <div className="ga-card-head">
        <span className="ga-card-title">Identificação</span>
        <span className="ga-caption">ftm_rule</span>
      </div>
      <div className="ga-card-body" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <div className="ga-field">
          <label className="ga-label">Código</label>
          <input className="ga-input ga-input-mono" value={form.code} onChange={(e) => set("code", e.target.value)} />
        </div>
        <div className="ga-field" style={{ gridColumn: "span 2" }}>
          <label className="ga-label">Nome</label>
          <input className="ga-input" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="ga-field" style={{ gridColumn: "1 / -1" }}>
          <label className="ga-label">Descrição</label>
          <input className="ga-input" value={form.desc} onChange={(e) => set("desc", e.target.value)} />
        </div>
        <div className="ga-field">
          <label className="ga-label">Schema-alvo</label>
          <select
            className="ga-select"
            value={form.schema}
            onChange={(e) => set("schema", e.target.value as FtmSchemaTarget)}
          >
            {SCHEMA_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {SCHEMA_TARGET_LABEL[s]}
              </option>
            ))}
          </select>
          <span className="ga-field-hint">Define a raiz da navegação em grafo das condições.</span>
        </div>
        <div className="ga-field">
          <label className="ga-label">Prioridade</label>
          <input
            className="ga-input ga-input-mono"
            type="number"
            min={1}
            max={1000}
            value={form.priority}
            onChange={(e) => set("priority", e.target.value)}
          />
        </div>
        <div className="ga-field">
          <label className="ga-label">Situação</label>
          <select
            className="ga-select"
            value={form.status}
            onChange={(e) => set("status", e.target.value as FtmRuleStatus)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {RULE_STATUS[s].label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
