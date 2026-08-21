import type { TabelaSimples } from "@/lib/mock/contribuinte-detalhe";
import { TabPageHead } from "./TabPageHead";
import { TabelaSimplesView } from "./TabelaSimplesView";

export function RecolhimentosTab({ tabela }: { tabela: TabelaSimples }) {
  return (
    <>
      <TabPageHead tab="recolhimentos" />
      <TabelaSimplesView tabela={tabela} unidade="códigos de receita" />
    </>
  );
}
