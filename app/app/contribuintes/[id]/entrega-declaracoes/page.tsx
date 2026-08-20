import type { Metadata } from "next";
import { getDeclaracoes } from "@/lib/mock/contribuinte-detalhe";
import { EntregaDeclaracoesTab } from "@/components/contribuinte/EntregaDeclaracoesTab";

export const metadata: Metadata = {
  title: "Entrega de declarações — Gertor de Alertas",
};

export default async function EntregaDeclaracoesPage({
  params,
}: PageProps<"/app/contribuintes/[id]/entrega-declaracoes">) {
  const { id } = await params;
  return <EntregaDeclaracoesTab tabela={getDeclaracoes(id)} />;
}
