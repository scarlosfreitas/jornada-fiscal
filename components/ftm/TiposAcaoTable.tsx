"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { SEVERITY_LABEL, type FtmAction } from "@/lib/mock/ftm";
import { ROUTES } from "@/lib/routes";
import { RowMenu } from "./RowMenu";
import { TipoAcaoFormModal, type TipoAcaoFormState } from "./TipoAcaoFormModal";

type Tab = "todas" | "on" | "off";

function emptyForm(): TipoAcaoFormState {
  return { id: null, code: "", name: "", desc: "", integration: "Painel", severity: "MEDIA", params: "", enabled: true };
}

let uid = 20;

export function TiposAcaoTable({ initialActions }: { initialActions: FtmAction[] }) {
  const [actions, setActions] = useState<FtmAction[]>(initialActions);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("todas");
  const [menuId, setMenuId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<TipoAcaoFormState>(emptyForm());

  const tabs: Array<{ key: Tab; label: string; count: number }> = [
    { key: "todas", label: "Todos", count: actions.length },
    { key: "on", label: "Habilitados", count: actions.filter((a) => a.enabled).length },
    { key: "off", label: "Desabilitados", count: actions.filter((a) => !a.enabled).length },
  ];

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      actions.filter((a) => {
        if (tab === "on" && !a.enabled) return false;
        if (tab === "off" && a.enabled) return false;
        if (!q) return true;
        return [a.code, a.name, a.desc, a.integration, a.params].join(" ").toLowerCase().includes(q);
      }),
    [actions, tab, q],
  );

  function openNew() {
    setForm(emptyForm());
    setModalOpen(true);
  }

  function openEdit(a: FtmAction) {
    setForm({
      id: a.id,
      code: a.code,
      name: a.name,
      desc: a.desc,
      integration: a.integration,
      severity: a.severity,
      params: a.params,
      enabled: a.enabled,
    });
    setMenuId(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm(emptyForm());
  }

  function testFire(a: FtmAction) {
    setMenuId(null);
    toast(`Disparo de teste enviado por ${a.integration}.`);
  }

  function disable(a: FtmAction) {
    setActions((prev) => prev.map((x) => (x.id === a.id ? { ...x, enabled: false } : x)));
    setMenuId(null);
    toast(`${a.code} desabilitado no editor de regras.`);
  }

  function saveForm() {
    if (!form.code.trim() || !form.name.trim()) {
      toast("Código e nome são obrigatórios.");
      return;
    }
    if (form.id !== null) {
      setActions((prev) =>
        prev.map((a) =>
          a.id === form.id
            ? {
                ...a,
                code: form.code,
                name: form.name,
                desc: form.desc,
                integration: form.integration,
                severity: form.severity,
                params: form.params,
                enabled: form.enabled,
              }
            : a,
        ),
      );
      toast(`${form.code} atualizado.`);
    } else {
      const id = ++uid;
      setActions((prev) => [
        ...prev,
        {
          id,
          code: form.code,
          name: form.name,
          desc: form.desc,
          integration: form.integration,
          severity: form.severity,
          params: form.params,
          enabled: form.enabled,
          rules: 0,
          fires: 0,
        },
      ]);
      toast(`${form.code} cadastrado.`);
    }
    closeModal();
  }

  return (
    <div className="ga-col" style={{ gap: 18 }}>
      <div className="ga-page-head">
        <div className="ga-page-head-text">
          <div className="ga-breadcrumb">
            <span>Ontologia FtM</span>
            <span>/</span>
            <span className="is-current">Tipos de Ação</span>
          </div>
          <h1 className="ga-page-title">Tipos de Ação</h1>
          <span className="ga-page-subtitle">
            Catálogo de ações e canais disparáveis pelas regras de alerta
          </span>
        </div>
        <div className="ga-page-actions">
          <div className="ga-search" style={{ width: 320 }}>
            <Search width={14} height={14} color="var(--ga-gray-400)" style={{ flex: "none" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por código, nome, integração ou parâmetro"
              aria-label="Buscar tipo de ação"
            />
          </div>
          <button type="button" className="ga-btn ga-btn-primary" onClick={openNew}>
            Criar ação
          </button>
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
                onClick={() => setTab(t.key)}
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
              <th style={{ width: 150 }}>Código</th>
              <th>Ação e comportamento</th>
              <th style={{ width: 150 }}>Integração</th>
              <th style={{ width: 110 }}>Severidade padrão</th>
              <th style={{ width: 130 }}>Regras · disparos</th>
              <th style={{ width: 120 }}>Situação</th>
              <th style={{ width: 56 }}></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((a) => {
              const params = a.params
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean);
              return (
                <tr key={a.id}>
                  <td className="ga-mono ga-body-sm">{a.code}</td>
                  <td>
                    <span className="ga-stack-2" style={{ gap: 4 }}>
                      <span className="ga-cell-primary">{a.name}</span>
                      <span className="ga-cell-meta">{a.desc}</span>
                      {params.length > 0 && (
                        <div className="ga-row ga-wrap" style={{ gap: 6 }}>
                          {params.map((p) => (
                            <span key={p} className="ga-chip ga-mono">
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className="ga-chip ga-chip-primary">{a.integration}</span>
                  </td>
                  <td>
                    <span className={`ga-level ${SEVERITY_LABEL[a.severity].cls}`}>{SEVERITY_LABEL[a.severity].label}</span>
                  </td>
                  <td className="ga-body-sm">
                    {a.rules ? a.rules : "—"} · {a.fires ? a.fires : "—"}
                  </td>
                  <td>
                    <span className={`ga-badge ${a.enabled ? "ga-badge-success" : "ga-badge-neutral"}`}>
                      {a.enabled ? "Habilitado" : "Desabilitado"}
                    </span>
                  </td>
                  <td className="ga-relative">
                    <RowMenu open={menuId === a.id} onOpenChange={(open) => setMenuId(open ? a.id : null)}>
                      <button type="button" className="ga-menu-item" onClick={() => openEdit(a)}>
                        Editar
                      </button>
                      <button type="button" className="ga-menu-item" onClick={() => testFire(a)}>
                        Disparo de teste
                      </button>
                      <Link href={ROUTES.regrasDeAlerta} className="ga-menu-item" onClick={() => setMenuId(null)}>
                        Ver regras vinculadas
                      </Link>
                      <div className="ga-menu-divider" />
                      <button
                        type="button"
                        className="ga-menu-item is-danger"
                        onClick={() => disable(a)}
                        disabled={!a.enabled}
                      >
                        Desabilitar
                      </button>
                    </RowMenu>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="ga-body-sm ga-muted" style={{ padding: "18px 12px" }}>
                  Nenhum tipo de ação encontrado para os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && <TipoAcaoFormModal form={form} onChange={setForm} onClose={closeModal} onSave={saveForm} />}
    </div>
  );
}
