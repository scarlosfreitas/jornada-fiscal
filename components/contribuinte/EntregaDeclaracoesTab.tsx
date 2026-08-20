"use client";

import { useState } from "react";
import type { TabelaSimples } from "@/lib/mock/contribuinte-detalhe";
import { TAB_META } from "./tab-meta";
import { TabPageHead } from "./TabPageHead";
import { SearchInput } from "./SearchInput";
import { TabelaSimplesView } from "./TabelaSimplesView";

export function EntregaDeclaracoesTab({ tabela }: { tabela: TabelaSimples }) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const rows = tabela.rows.filter(
    (r) => q === "" || `${r.code} ${r.desc}`.toLowerCase().includes(q),
  );

  return (
    <>
      <TabPageHead tab="entrega-declaracoes">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={TAB_META["entrega-declaracoes"].searchPlaceholder}
        />
      </TabPageHead>
      <TabelaSimplesView tabela={tabela} rows={rows} unidade="declarações" />
    </>
  );
}
