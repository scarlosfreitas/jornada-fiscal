"use client";

import { useState } from "react";
import type { TabelaSimples } from "@/lib/mock/contribuinte-detalhe";
import { TabPageHead } from "./TabPageHead";
import { TabelaSimplesView } from "./TabelaSimplesView";

const METRICAS = ["VPROD", "VNF", "BC", "BCST", "VICMS", "VST", "VICMSDESON"];

export function EmissaoDocumentosTab({ tabela }: { tabela: TabelaSimples }) {
  const [posicao, setPosicao] = useState("emitente");
  const [metrica, setMetrica] = useState("VPROD");

  return (
    <>
      <TabPageHead tab="emissao-documentos">
        <select
          className="ga-select"
          value={posicao}
          onChange={(e) => setPosicao(e.target.value)}
          aria-label="Posição do contribuinte"
        >
          <option value="emitente">Emitente</option>
          <option value="destinatario">Destinatário</option>
        </select>
        <select
          className="ga-select"
          value={metrica}
          onChange={(e) => setMetrica(e.target.value)}
          aria-label="Métrica de valor"
        >
          {METRICAS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </TabPageHead>
      <TabelaSimplesView
        tabela={tabela}
        unidade="tipos de documento"
        toolbar={
          <div className="ga-table-toolbar">
            <span className="ga-card-title">
              Documentos com o contribuinte como {posicao === "emitente" ? "emitente" : "destinatário"}
            </span>
            <span className="ga-pagination-info">Métrica de valor · {metrica}</span>
          </div>
        }
      />
    </>
  );
}
