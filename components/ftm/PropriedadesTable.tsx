"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import {
  FTM_STATUS_LABEL,
  PROPERTY_TYPES,
  PROPERTY_USES,
  schemaById,
  type FtmProperty,
  type FtmSchema,
  type FtmStatus,
} from "@/lib/mock/ftm";
import { ROUTES } from "@/lib/routes";
import { RowMenu } from "./RowMenu";
import { Switch } from "./Switch";
import { PropriedadeFormModal, type PropriedadeFormState } from "./PropriedadeFormModal";

type Tab = "todas" | "obs" | "entity" | "inativas";
const ENTITY_TYPE_ID = 8;

function emptyForm(): PropriedadeFormState {
  return {
    id: null,
    schemaId: 6,
    name: "",
    label: "",
    desc: "",
    typeId: 1,
    targetSchemaId: 4,
    multi: false,
    observable: false,
    status: "EM_TESTE",
  };
}

let uid = 400;

export function PropriedadesTable({
  schemas,
  initialProperties,
}: {
  schemas: FtmSchema[];
  initialProperties: FtmProperty[];
}) {
  const [properties, setProperties] = useState<FtmProperty[]>(initialProperties);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("todas");
  const [schemaFilter, setSchemaFilter] = useState<"todos" | number>("todos");
  const [typeFilter, setTypeFilter] = useState<"todos" | number>("todos");
  const [menuId, setMenuId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<PropriedadeFormState>(emptyForm());

  const tabs: Array<{ key: Tab; label: string; count: number }> = [
    { key: "todas", label: "Todas", count: properties.length },
    { key: "obs", label: "Observáveis", count: properties.filter((p) => p.observable).length },
    { key: "entity", label: "Relacionamentos", count: properties.filter((p) => p.typeId === ENTITY_TYPE_ID).length },
    {
      key: "inativas",
      label: "Suspensas / arquivadas",
      count: properties.filter((p) => p.status === "SUSPENSA" || p.status === "ARQUIVADA").length,
    },
  ];

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      properties.filter((p) => {
        if (tab === "obs" && !p.observable) return false;
        if (tab === "entity" && p.typeId !== ENTITY_TYPE_ID) return false;
        if (tab === "inativas" && p.status !== "SUSPENSA" && p.status !== "ARQUIVADA") return false;
        if (schemaFilter !== "todos" && p.schemaId !== schemaFilter) return false;
        if (typeFilter !== "todos" && p.typeId !== typeFilter) return false;
        if (!q) return true;
        const owner = schemaById(p.schemaId);
        return [p.name, p.label, p.desc, owner?.name ?? ""].join(" ").toLowerCase().includes(q);
      }),
    [properties, tab, schemaFilter, typeFilter, q],
  );

  function toggleObservable(id: number) {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, observable: !p.observable } : p)));
  }

  function setStatus(id: number, status: FtmStatus) {
    const prop = properties.find((p) => p.id === id);
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    setMenuId(null);
    if (prop) toast(`Situação alterada para ${FTM_STATUS_LABEL[status].label}.`);
  }

  function openNew() {
    setForm(emptyForm());
    setModalOpen(true);
  }

  function openEdit(p: FtmProperty) {
    setForm({
      id: p.id,
      schemaId: p.schemaId,
      name: p.name,
      label: p.label,
      desc: p.desc,
      typeId: p.typeId,
      targetSchemaId: p.targetSchemaId ?? 4,
      multi: p.multi,
      observable: p.observable,
      status: p.status,
    });
    setMenuId(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm(emptyForm());
  }

  function saveForm() {
    if (!form.name.trim() || !form.label.trim()) {
      toast("Nome técnico e rótulo são obrigatórios.");
      return;
    }
    const targetSchemaId = form.typeId === ENTITY_TYPE_ID ? form.targetSchemaId : null;
    if (form.id !== null) {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === form.id
            ? {
                ...p,
                schemaId: form.schemaId,
                name: form.name,
                label: form.label,
                desc: form.desc,
                typeId: form.typeId,
                targetSchemaId,
                multi: form.multi,
                observable: form.observable,
                status: form.status,
              }
            : p,
        ),
      );
      toast(`${form.name} atualizada.`);
    } else {
      const id = ++uid;
      setProperties((prev) => [
        ...prev,
        {
          id,
          schemaId: form.schemaId,
          name: form.name,
          label: form.label,
          desc: form.desc,
          typeId: form.typeId,
          targetSchemaId,
          multi: form.multi,
          observable: form.observable,
          status: form.status,
        },
      ]);
      const owner = schemaById(form.schemaId);
      toast(`${form.name} cadastrada em ${owner ? owner.name : form.schemaId}.`);
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
            <span className="is-current">Propriedades</span>
          </div>
          <h1 className="ga-page-title">Propriedades</h1>
          <span className="ga-page-subtitle">
            Catálogo de propriedades FtM referenciáveis nas condições das regras de alerta
          </span>
        </div>
        <div className="ga-page-actions">
          <div className="ga-search" style={{ width: 320 }}>
            <Search width={14} height={14} color="var(--ga-gray-400)" style={{ flex: "none" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, rótulo, descrição ou schema"
              aria-label="Buscar propriedade"
            />
          </div>
          <Link href={ROUTES.ftmEntidades} className="ga-btn ga-btn-secondary">
            Ver entidades
          </Link>
          <button type="button" className="ga-btn ga-btn-primary" onClick={openNew}>
            Cadastrar propriedade
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
          <div className="ga-row" style={{ gap: 8 }}>
            <select
              className="ga-select ga-select-sm"
              value={schemaFilter}
              onChange={(e) => setSchemaFilter(e.target.value === "todos" ? "todos" : Number(e.target.value))}
              aria-label="Filtrar por schema"
            >
              <option value="todos">Todos os schemas</option>
              {schemas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.label}
                </option>
              ))}
            </select>
            <select
              className="ga-select ga-select-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value === "todos" ? "todos" : Number(e.target.value))}
              aria-label="Filtrar por tipo de dado"
            >
              <option value="todos">Todos os tipos</option>
              {Object.entries(PROPERTY_TYPES).map(([id, meta]) => (
                <option key={id} value={id}>
                  {meta.name} — {meta.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="ga-table">
          <thead>
            <tr>
              <th>Propriedade</th>
              <th style={{ width: 150 }}>Schema</th>
              <th style={{ width: 170 }}>Tipo</th>
              <th style={{ width: 70 }}>Multi</th>
              <th style={{ width: 90 }}>Observ.</th>
              <th style={{ width: 130 }}>Situação</th>
              <th style={{ width: 80, textAlign: "right" }}>Usos</th>
              <th style={{ width: 56 }}></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => {
              const typeMeta = PROPERTY_TYPES[p.typeId];
              const target = p.targetSchemaId ? schemaById(p.targetSchemaId) : undefined;
              const owner = schemaById(p.schemaId);
              const dim = p.status === "SUSPENSA" || p.status === "ARQUIVADA";
              const uses = PROPERTY_USES[p.id];
              return (
                <tr key={p.id}>
                  <td>
                    <span className="ga-stack-2" style={{ gap: 2 }}>
                      <span
                        className="ga-cell-primary ga-mono"
                        style={{ color: dim ? "var(--ga-gray-400)" : undefined }}
                      >
                        {p.name}
                      </span>
                      <span className="ga-cell-meta">{p.label}</span>
                    </span>
                  </td>
                  <td className="ga-mono ga-body-sm">{owner ? owner.name : "—"}</td>
                  <td className="ga-body-sm">
                    {typeMeta.name}
                    {p.typeId === ENTITY_TYPE_ID && target && (
                      <span className="ga-chip ga-chip-primary" style={{ marginLeft: 6 }}>
                        {target.name}
                      </span>
                    )}
                  </td>
                  <td>{p.multi ? "sim" : "—"}</td>
                  <td>
                    <Switch on={p.observable} onToggle={() => toggleObservable(p.id)} label={`Observável de ${p.name}`} />
                  </td>
                  <td>
                    <span className={`ga-badge ${FTM_STATUS_LABEL[p.status].cls}`}>{FTM_STATUS_LABEL[p.status].label}</span>
                  </td>
                  <td className="ga-table-num">{uses ? uses : "—"}</td>
                  <td className="ga-relative">
                    <RowMenu open={menuId === p.id} onOpenChange={(open) => setMenuId(open ? p.id : null)}>
                      <button type="button" className="ga-menu-item" onClick={() => openEdit(p)}>
                        Editar propriedade
                      </button>
                      <div className="ga-menu-divider" />
                      <button type="button" className="ga-menu-item" onClick={() => setStatus(p.id, "EM_TESTE")}>
                        Em teste
                      </button>
                      <button type="button" className="ga-menu-item" onClick={() => setStatus(p.id, "ATIVA")}>
                        Ativa
                      </button>
                      <button type="button" className="ga-menu-item" onClick={() => setStatus(p.id, "SUSPENSA")}>
                        Suspender
                      </button>
                      <button type="button" className="ga-menu-item is-danger" onClick={() => setStatus(p.id, "ARQUIVADA")}>
                        Arquivar
                      </button>
                    </RowMenu>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="ga-body-sm ga-muted" style={{ padding: "18px 12px" }}>
                  Nenhuma propriedade encontrada para os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="ga-pagination">
          <span className="ga-pagination-info">
            Exibindo <strong>{visible.length}</strong> de <strong>{properties.length}</strong> propriedades
          </span>
          <span className="ga-pagination-info">{visible.filter((p) => p.observable).length} observáveis no recorte atual</span>
        </div>
      </div>

      {modalOpen && (
        <PropriedadeFormModal form={form} onChange={setForm} schemas={schemas} onClose={closeModal} onSave={saveForm} />
      )}
    </div>
  );
}
