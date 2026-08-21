"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { OBSERVABLES, type FtmList, type FtmListItem } from "@/lib/mock/listas";
import { ROUTES } from "@/lib/routes";
import { ListaIdentificacao, type ListaForm } from "./ListaIdentificacao";
import { ListaItens } from "./ListaItens";
import { ListaConsumidores } from "./ListaConsumidores";

export function ListaEditor({ lista, isNew = false }: { lista: FtmList; isNew?: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState<ListaForm>({
    code: lista.code,
    name: lista.name,
    desc: lista.desc,
    observableId: lista.observableId,
    status: lista.status,
  });
  const [items, setItems] = useState<FtmListItem[]>(lista.items);

  const observable = OBSERVABLES.find((o) => o.id === form.observableId);
  const canSave = form.code.trim() !== "" && form.name.trim() !== "";

  function handleSave() {
    if (!canSave) return;
    toast.success(`Lista ${form.code} criada. Ainda sem persistência real — as watchlists são apenas mock.`);
    router.push(ROUTES.alertasListas);
  }

  return (
    <div className="ga-col" style={{ gap: 18 }}>
      <div className="ga-page-head">
        <div className="ga-page-head-text">
          <div className="ga-breadcrumb">
            <Link href={ROUTES.alertasListas}>Listas</Link>
            <span>/</span>
            <span className="is-current">{isNew ? "Nova lista" : lista.code}</span>
          </div>
          <h1 className="ga-page-title">{isNew ? form.name || "Nova lista" : form.name}</h1>
          <span className="ga-page-subtitle">
            {isNew ? form.desc || "Preencha a identificação e o observável indexado pela nova lista." : form.desc}
          </span>
        </div>
        <div className="ga-page-actions">
          <Link href={ROUTES.alertasListas} className="ga-btn ga-btn-secondary">
            Cancelar
          </Link>
          {isNew && (
            <button
              type="button"
              className="ga-btn ga-btn-primary"
              onClick={handleSave}
              disabled={!canSave}
              title={canSave ? undefined : "Preencha código e nome para salvar"}
            >
              Salvar lista
            </button>
          )}
        </div>
      </div>

      <ListaIdentificacao form={form} onChange={setForm} />
      <ListaItens items={items} onChange={setItems} placeholder={observable?.placeholder ?? "valor do observável"} />
      {!isNew && <ListaConsumidores consumers={lista.consumers} />}
    </div>
  );
}
