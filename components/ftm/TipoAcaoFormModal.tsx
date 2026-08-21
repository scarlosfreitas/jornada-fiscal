"use client";

import { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { SEVERITY_LABEL, type FtmSeverity } from "@/lib/mock/ftm";
import { Switch } from "./Switch";

export interface TipoAcaoFormState {
  id: number | null;
  code: string;
  name: string;
  desc: string;
  integration: string;
  severity: FtmSeverity;
  params: string;
  enabled: boolean;
}

const SEVERITY_OPTIONS: FtmSeverity[] = ["BAIXA", "MEDIA", "ALTA", "CRITICA"];

export function TipoAcaoFormModal({
  form,
  onChange,
  onClose,
  onSave,
}: {
  form: TipoAcaoFormState;
  onChange: (form: TipoAcaoFormState) => void;
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

  const isEditing = form.id !== null;

  const astSample = useMemo(() => {
    const params: Record<string, string> = {};
    (form.params || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .forEach((k) => {
        params[k] = "…";
      });
    return JSON.stringify({ type: form.code || "ACAO_CODIGO", severity: form.severity, params }, null, 2);
  }, [form.code, form.severity, form.params]);

  function onCodeChange(value: string) {
    onChange({ ...form, code: value.toUpperCase().replace(/[^A-Z0-9_]/g, "_") });
  }

  return (
    <div
      className="ga-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? `Editar tipo de ação ${form.code}` : "Novo tipo de ação"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="ga-modal" style={{ maxWidth: 640, maxHeight: "88vh" }}>
        <div className="ga-modal-head">
          <div className="ga-stack-2" style={{ gap: 4 }}>
            <span className="ga-overline">{isEditing ? "Editar tipo de ação" : "Novo tipo de ação"}</span>
            <span className="ga-section-title">{isEditing ? `ftm_action #${form.id}` : "Nova entrada em ftm_action"}</span>
          </div>
          <button type="button" className="ga-modal-close" onClick={onClose} aria-label="Fechar">
            <X size={14} />
          </button>
        </div>

        <div className="ga-modal-body">
          <div className="ga-form-grid">
            <div className="ga-field" style={{ minWidth: 0 }}>
              <label className="ga-label">Código da ação</label>
              <input
                className="ga-input ga-input-mono"
                value={form.code}
                onChange={(e) => onCodeChange(e.target.value)}
              />
            </div>
            <div className="ga-field" style={{ minWidth: 0 }}>
              <label className="ga-label">Nome amigável</label>
              <input className="ga-input" value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} />
            </div>
            <div className="ga-field" style={{ minWidth: 0 }}>
              <label className="ga-label">Integração de destino</label>
              <input
                className="ga-input"
                value={form.integration}
                onChange={(e) => onChange({ ...form, integration: e.target.value })}
              />
            </div>
            <div className="ga-field" style={{ minWidth: 0 }}>
              <label className="ga-label">Severidade padrão</label>
              <select
                className="ga-select"
                value={form.severity}
                onChange={(e) => onChange({ ...form, severity: e.target.value as FtmSeverity })}
              >
                {SEVERITY_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {SEVERITY_LABEL[s].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="ga-field ga-col-span-2" style={{ minWidth: 0 }}>
              <label className="ga-label">Parâmetros esperados (separados por vírgula)</label>
              <input className="ga-input" value={form.params} onChange={(e) => onChange({ ...form, params: e.target.value })} />
            </div>
            <div className="ga-field ga-col-span-2" style={{ minWidth: 0 }}>
              <label className="ga-label">Descrição do comportamento e integrações acionadas</label>
              <textarea
                className="ga-textarea"
                rows={2}
                value={form.desc}
                onChange={(e) => onChange({ ...form, desc: e.target.value })}
              />
            </div>
            <div className="ga-field ga-col-span-2" style={{ minWidth: 0 }}>
              <label className="ga-label">Habilitação no editor de regras</label>
              <div className="ga-row" style={{ gap: 10 }}>
                <Switch on={form.enabled} onToggle={() => onChange({ ...form, enabled: !form.enabled })} label="Habilitado no editor de regras" />
                <span className="ga-body-sm ga-muted">
                  {form.enabled ? "aparece na lista de ações da regra" : "oculto para novas regras"}
                </span>
              </div>
            </div>
          </div>

          <div className="ga-card" style={{ marginTop: 16 }}>
            <div className="ga-card-head">
              <span className="ga-card-title">Trecho na AST da regra</span>
            </div>
            <div className="ga-card-body" style={{ padding: "14px 18px" }}>
              <pre className="ga-mono ga-body-sm" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {astSample}
              </pre>
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
