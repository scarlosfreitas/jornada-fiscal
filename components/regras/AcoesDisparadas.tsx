"use client";

import { ACTION_TYPE_LABEL, type FtmActionTrigger, type FtmActionType, type FtmSeverity } from "@/lib/mock/regras";

let uid = 2000;
const nextId = () => `a${++uid}`;

const ACTION_OPTIONS = Object.keys(ACTION_TYPE_LABEL) as FtmActionType[];
const SEVERITY_OPTIONS: FtmSeverity[] = ["BAIXA", "MEDIA", "ALTA", "CRITICA"];

export function AcoesDisparadas({
  actions,
  onChange,
}: {
  actions: FtmActionTrigger[];
  onChange: (actions: FtmActionTrigger[]) => void;
}) {
  function addAction() {
    onChange([...actions, { id: nextId(), type: ACTION_OPTIONS[0], severity: "MEDIA", params: "{}" }]);
  }

  function removeAction(id: string) {
    onChange(actions.filter((a) => a.id !== id));
  }

  function update(id: string, patch: Partial<FtmActionTrigger>) {
    onChange(actions.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  return (
    <div className="ga-card">
      <div className="ga-card-head">
        <div className="ga-stack-2" style={{ gap: 3 }}>
          <span className="ga-card-title">Ações disparadas</span>
          <span className="ga-caption">ftm_action · severidade e parâmetros por canal</span>
        </div>
        <button type="button" className="ga-btn ga-btn-sm ga-btn-secondary" onClick={addAction}>
          + Ação
        </button>
      </div>
      <table className="ga-table">
        <thead>
          <tr>
            <th style={{ width: 250 }}>Tipo de ação</th>
            <th style={{ width: 160 }}>Severidade</th>
            <th>Parâmetros</th>
            <th style={{ width: 56 }}></th>
          </tr>
        </thead>
        <tbody>
          {actions.map((a) => (
            <tr key={a.id}>
              <td>
                <select
                  className="ga-select ga-select-sm"
                  value={a.type}
                  onChange={(e) => update(a.id, { type: e.target.value as FtmActionType })}
                >
                  {ACTION_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {ACTION_TYPE_LABEL[t].label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className="ga-select ga-select-sm"
                  value={a.severity}
                  onChange={(e) => update(a.id, { severity: e.target.value as FtmSeverity })}
                >
                  {SEVERITY_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  className="ga-input ga-input-sm ga-input-mono"
                  value={a.params}
                  onChange={(e) => update(a.id, { params: e.target.value })}
                />
              </td>
              <td>
                <button
                  type="button"
                  className="ga-btn ga-btn-sm ga-btn-ghost"
                  style={{ color: "var(--ga-danger)" }}
                  onClick={() => removeAction(a.id)}
                  aria-label="Remover ação"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
          {actions.length === 0 && (
            <tr>
              <td colSpan={4} className="ga-body-sm ga-muted" style={{ padding: "14px 12px" }}>
                Nenhuma ação cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
