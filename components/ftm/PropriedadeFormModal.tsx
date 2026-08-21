"use client";

import { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import {
  FTM_STATUS_LABEL,
  OPERATORS_BY_TYPE,
  PROPERTY_TYPES,
  schemaById,
  type FtmSchema,
  type FtmStatus,
} from "@/lib/mock/ftm";
import { Switch } from "./Switch";

export interface PropriedadeFormState {
  id: number | null;
  schemaId: number;
  name: string;
  label: string;
  desc: string;
  typeId: number;
  targetSchemaId: number;
  multi: boolean;
  observable: boolean;
  status: FtmStatus;
}

const STATUS_OPTIONS: FtmStatus[] = ["EM_TESTE", "ATIVA", "SUSPENSA", "ARQUIVADA"];
const ENTITY_TYPE_ID = 8;

export function PropriedadeFormModal({
  form,
  onChange,
  schemas,
  onClose,
  onSave,
}: {
  form: PropriedadeFormState;
  onChange: (form: PropriedadeFormState) => void;
  schemas: FtmSchema[];
  onClose: () => void;
  onSave: () => void;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const isEntity = form.typeId === ENTITY_TYPE_ID;
  const isEditing = form.id !== null;

  const pathPreview = useMemo(() => {
    const owner = schemaById(form.schemaId);
    return `caminho em regras: ${owner ? owner.name : "…"}.${form.name || "…"}`;
  }, [form.schemaId, form.name]);

  const compatOps = useMemo(
    () =>
      Object.entries(OPERATORS_BY_TYPE)
        .filter(([, meta]) => meta.types.includes(form.typeId))
        .map(([code, meta]) => ({ code, label: meta.label })),
    [form.typeId],
  );

  return (
    <div
      className="ga-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? `Editar propriedade ${form.name}` : "Cadastrar propriedade"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="ga-modal" style={{ maxWidth: 640, maxHeight: "88vh" }}>
        <div className="ga-modal-head">
          <div className="ga-stack-2" style={{ gap: 4 }}>
            <span className="ga-overline">{isEditing ? "Editar propriedade" : "Cadastrar propriedade"}</span>
            <span className="ga-section-title">{isEditing ? `ftm_property #${form.id}` : "Nova entrada em ftm_property"}</span>
          </div>
          <button type="button" className="ga-modal-close" onClick={onClose} aria-label="Fechar">
            <X size={14} />
          </button>
        </div>

        <div className="ga-modal-body">
          <div className="ga-form-grid">
            <div className="ga-field" style={{ minWidth: 0 }}>
              <label className="ga-label">Schema proprietário</label>
              <select
                className="ga-select"
                value={form.schemaId}
                onChange={(e) => onChange({ ...form, schemaId: Number(e.target.value) })}
              >
                {schemas.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="ga-field" style={{ minWidth: 0 }}>
              <label className="ga-label">Nome técnico (camelCase)</label>
              <input
                className="ga-input ga-input-mono"
                value={form.name}
                onChange={(e) => onChange({ ...form, name: e.target.value })}
              />
            </div>
            <div className="ga-field" style={{ minWidth: 0 }}>
              <label className="ga-label">Rótulo na interface</label>
              <input className="ga-input" value={form.label} onChange={(e) => onChange({ ...form, label: e.target.value })} />
            </div>
            <div className="ga-field" style={{ minWidth: 0 }}>
              <label className="ga-label">Tipo de dado</label>
              <select
                className="ga-select"
                value={form.typeId}
                onChange={(e) => onChange({ ...form, typeId: Number(e.target.value) })}
              >
                {Object.entries(PROPERTY_TYPES).map(([id, meta]) => (
                  <option key={id} value={id}>
                    {meta.name} — {meta.label}
                  </option>
                ))}
              </select>
            </div>
            {isEntity && (
              <div className="ga-field" style={{ minWidth: 0 }}>
                <label className="ga-label">Schema de destino</label>
                <select
                  className="ga-select"
                  value={form.targetSchemaId}
                  onChange={(e) => onChange({ ...form, targetSchemaId: Number(e.target.value) })}
                >
                  {schemas.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="ga-field" style={{ minWidth: 0 }}>
              <label className="ga-label">Situação</label>
              <select
                className="ga-select"
                value={form.status}
                onChange={(e) => onChange({ ...form, status: e.target.value as FtmStatus })}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {FTM_STATUS_LABEL[s].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="ga-field" style={{ minWidth: 0 }}>
              <label className="ga-label">Cardinalidade múltipla</label>
              <Switch on={form.multi} onToggle={() => onChange({ ...form, multi: !form.multi })} label="Cardinalidade múltipla" />
            </div>
            <div className="ga-field" style={{ minWidth: 0 }}>
              <label className="ga-label">Observável</label>
              <div className="ga-row" style={{ gap: 10 }}>
                <Switch
                  on={form.observable}
                  onToggle={() => onChange({ ...form, observable: !form.observable })}
                  label="Observável investigativo"
                />
                <span className="ga-body-sm ga-muted">
                  {form.observable ? "is_observable — pode indexar watchlists" : "não indexável em listas"}
                </span>
              </div>
            </div>
            <div className="ga-field ga-col-span-2" style={{ minWidth: 0 }}>
              <label className="ga-label">Descrição fiscal e origem do dado</label>
              <textarea
                className="ga-textarea"
                rows={2}
                value={form.desc}
                onChange={(e) => onChange({ ...form, desc: e.target.value })}
              />
            </div>
          </div>

          <div className="ga-card" style={{ marginTop: 16 }}>
            <div className="ga-card-body" style={{ padding: "14px 18px", gap: 10 }}>
              <span className="ga-mono ga-body-sm">{pathPreview}</span>
              <div className="ga-row ga-wrap" style={{ gap: 6 }}>
                {compatOps.map((op) => (
                  <span key={op.code} className="ga-chip">
                    {op.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ga-modal-foot" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="ga-btn ga-btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="ga-btn ga-btn-primary" onClick={onSave}>
            {isEditing ? "Salvar alterações" : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
