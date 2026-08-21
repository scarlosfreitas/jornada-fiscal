"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { FtmListItem } from "@/lib/mock/listas";

let uid = 3000;
const nextId = () => ++uid;

function today(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function ListaItens({
  items,
  onChange,
  placeholder,
}: {
  items: FtmListItem[];
  onChange: (items: FtmListItem[]) => void;
  placeholder: string;
}) {
  const [showClosed, setShowClosed] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [newReason, setNewReason] = useState("");
  const [newFrom, setNewFrom] = useState(today());
  const [closingId, setClosingId] = useState<number | null>(null);
  const [closeDate, setCloseDate] = useState(today());
  const [closeReason, setCloseReason] = useState("");

  const visible = items.filter((i) => showClosed || !i.validTo);
  const closing = items.find((i) => i.id === closingId) ?? null;

  function addItem() {
    if (!newValue.trim() || !newReason.trim()) return;
    onChange([
      ...items,
      { id: nextId(), value: newValue.trim(), reasonIn: newReason.trim(), reasonOut: null, validFrom: newFrom, validTo: null },
    ]);
    setNewValue("");
    setNewReason("");
  }

  function confirmClose() {
    if (!closing || !closeReason.trim()) return;
    onChange(items.map((i) => (i.id === closing.id ? { ...i, reasonOut: closeReason.trim(), validTo: closeDate } : i)));
    setClosingId(null);
    setCloseReason("");
  }

  return (
    <div className="ga-card">
      <div className="ga-card-head">
        <div className="ga-stack-2" style={{ gap: 3 }}>
          <span className="ga-card-title">Itens da lista</span>
          <span className="ga-caption">ftm_list_item · vigência temporal (SCD Tipo 2)</span>
        </div>
        <label className="ga-row" style={{ gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} />
          <span className="ga-caption">Mostrar itens encerrados</span>
        </label>
      </div>

      <div className="ga-card-body" style={{ padding: "16px 20px" }}>
        <div className="ga-row ga-wrap" style={{ gap: 10, marginBottom: 16 }}>
          <input
            className="ga-input ga-input-mono"
            style={{ flex: "1 1 200px" }}
            placeholder={placeholder}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
          <input
            className="ga-input"
            style={{ flex: "2 1 260px" }}
            placeholder="Justificativa de inclusão"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
          />
          <input
            className="ga-input ga-input-mono"
            style={{ width: 130, flex: "none" }}
            value={newFrom}
            onChange={(e) => setNewFrom(e.target.value)}
          />
          <button type="button" className="ga-btn ga-btn-sm ga-btn-secondary" onClick={addItem}>
            + Incluir item
          </button>
        </div>

        <table className="ga-table">
          <thead>
            <tr>
              <th>Valor</th>
              <th>Justificativa</th>
              <th style={{ width: 110 }}>Início</th>
              <th style={{ width: 110 }}>Término</th>
              <th style={{ width: 110 }}></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((i) => (
              <tr key={i.id}>
                <td className="ga-mono">{i.value}</td>
                <td>
                  <span className="ga-stack-2" style={{ gap: 2 }}>
                    <span className="ga-cell-primary">{i.reasonIn}</span>
                    {i.reasonOut && <span className="ga-cell-meta">Encerrado: {i.reasonOut}</span>}
                  </span>
                </td>
                <td className="ga-mono">{i.validFrom}</td>
                <td className="ga-mono">{i.validTo ?? "—"}</td>
                <td>
                  {!i.validTo && (
                    <button type="button" className="ga-btn ga-btn-sm ga-btn-ghost" onClick={() => setClosingId(i.id)}>
                      Encerrar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="ga-body-sm ga-muted" style={{ padding: "14px 12px" }}>
                  Nenhum item vigente nesta lista.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {closing && (
        <div
          className="ga-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`Encerrar vigência de ${closing.value}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setClosingId(null);
          }}
        >
          <div className="ga-modal" style={{ maxWidth: 460 }}>
            <div className="ga-modal-head">
              <div className="ga-stack-2" style={{ gap: 4 }}>
                <span className="ga-overline">Encerrar vigência</span>
                <span className="ga-section-title ga-mono">{closing.value}</span>
              </div>
              <button type="button" className="ga-modal-close" onClick={() => setClosingId(null)} aria-label="Fechar">
                <X size={14} />
              </button>
            </div>
            <div className="ga-modal-body">
              <div className="ga-field">
                <label className="ga-label">Justificativa de encerramento</label>
                <input className="ga-input" value={closeReason} onChange={(e) => setCloseReason(e.target.value)} />
              </div>
              <div className="ga-field">
                <label className="ga-label">Data de término</label>
                <input className="ga-input ga-input-mono" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} />
              </div>
            </div>
            <div className="ga-modal-foot" style={{ justifyContent: "flex-end" }}>
              <button type="button" className="ga-btn ga-btn-secondary" onClick={() => setClosingId(null)}>
                Cancelar
              </button>
              <button type="button" className="ga-btn ga-btn-primary" onClick={confirmClose} disabled={!closeReason.trim()}>
                Encerrar vigência
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
