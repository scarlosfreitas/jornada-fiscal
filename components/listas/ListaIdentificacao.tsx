"use client";

import { LIST_STATUS_LABEL, OBSERVABLES, type FtmListStatus } from "@/lib/mock/listas";

export interface ListaForm {
  code: string;
  name: string;
  desc: string;
  observableId: number;
  status: FtmListStatus;
}

const STATUS_OPTIONS = Object.keys(LIST_STATUS_LABEL) as FtmListStatus[];

export function ListaIdentificacao({
  form,
  onChange,
}: {
  form: ListaForm;
  onChange: (form: ListaForm) => void;
}) {
  const set = <K extends keyof ListaForm>(key: K, value: ListaForm[K]) => onChange({ ...form, [key]: value });

  return (
    <div className="ga-card">
      <div className="ga-card-head">
        <span className="ga-card-title">Identificação</span>
        <span className="ga-caption">ftm_list</span>
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
          <label className="ga-label">Observável</label>
          <select
            className="ga-select"
            value={form.observableId}
            onChange={(e) => set("observableId", Number(e.target.value))}
          >
            {OBSERVABLES.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="ga-field">
          <label className="ga-label">Situação</label>
          <select className="ga-select" value={form.status} onChange={(e) => set("status", e.target.value as FtmListStatus)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {LIST_STATUS_LABEL[s].label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
