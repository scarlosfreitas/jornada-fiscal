import type { Metadata } from "next";
import { getHistoricoCadastral } from "@/lib/mock/contribuinte-detalhe";
import { HistoricoCadastralTab } from "@/components/contribuinte/HistoricoCadastralTab";

export const metadata: Metadata = {
  title: "Histórico do contribuinte — Gertor de Alertas",
};

export default async function HistoricoPage({
  params,
}: PageProps<"/app/contribuintes/[id]/historico">) {
  const { id } = await params;
  return <HistoricoCadastralTab dados={getHistoricoCadastral(id)} />;
}
