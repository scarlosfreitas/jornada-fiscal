"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { FtmActionTrigger, FtmConditionNode, FtmRule } from "@/lib/mock/regras";
import { ROUTES } from "@/lib/routes";
import { RegraIdentificacao, type RegraForm } from "./RegraIdentificacao";
import { ConditionTree } from "./ConditionTree";
import { AcoesDisparadas } from "./AcoesDisparadas";
import { AstPreview } from "./AstPreview";
import { HistoricoVersoes } from "./HistoricoVersoes";

export function RegraEditor({ regra, isNew = false }: { regra: FtmRule; isNew?: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState<RegraForm>({
    code: regra.code,
    name: regra.name,
    desc: regra.desc,
    schema: regra.schema,
    priority: String(regra.priority),
    status: regra.status,
  });
  const [tree, setTree] = useState<FtmConditionNode>(regra.tree);
  const [actions, setActions] = useState<FtmActionTrigger[]>(regra.actions);

  const canSave = form.code.trim() !== "" && form.name.trim() !== "";

  function handleSave() {
    if (!canSave) return;
    toast.success(`Regra ${form.code} criada. Ainda sem persistência real — o motor de regras é apenas mock.`);
    router.push(ROUTES.regrasDeAlerta);
  }

  return (
    <div className="ga-col" style={{ gap: 18 }}>
      <div className="ga-page-head">
        <div className="ga-page-head-text">
          <div className="ga-breadcrumb">
            <Link href={ROUTES.regrasDeAlerta}>Regras</Link>
            <span>/</span>
            <span className="is-current">{isNew ? "Nova regra" : regra.code}</span>
          </div>
          <h1 className="ga-page-title">{isNew ? form.name || "Nova regra" : form.name}</h1>
          <span className="ga-page-subtitle">
            {isNew ? form.desc || "Preencha a identificação, as condições e as ações da nova regra." : form.desc}
          </span>
        </div>
        <div className="ga-page-actions">
          {isNew ? (
            <>
              <Link href={ROUTES.regrasDeAlerta} className="ga-btn ga-btn-secondary">
                Cancelar
              </Link>
              <button
                type="button"
                className="ga-btn ga-btn-primary"
                onClick={handleSave}
                disabled={!canSave}
                title={canSave ? undefined : "Preencha código e nome para salvar"}
              >
                Salvar regra
              </button>
            </>
          ) : (
            <>
              <button type="button" className="ga-btn ga-btn-secondary" disabled title="Backtest ainda não disponível">
                Executar backtest no Lakehouse
              </button>
              <button type="button" className="ga-btn ga-btn-secondary" disabled title="Exportação ainda não disponível">
                Exportar AST
              </button>
              <Link href={ROUTES.regrasDeAlerta} className="ga-btn ga-btn-secondary">
                Cancelar
              </Link>
            </>
          )}
        </div>
      </div>

      <RegraIdentificacao form={form} onChange={setForm} />
      <ConditionTree schema={form.schema} tree={tree} onChange={setTree} />
      <AcoesDisparadas actions={actions} onChange={setActions} />
      <AstPreview name={form.name} schema={form.schema} tree={tree} actions={actions} />
      {!isNew && <HistoricoVersoes versions={regra.versions} />}
    </div>
  );
}
