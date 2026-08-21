import type { Metadata } from "next";
import { getHistoricoRegime, HISTORICO_COLUNAS } from "@/lib/sate-hist-regime";
import { HistoricoCadastralTab } from "@/components/contribuinte/HistoricoCadastralTab";

export const metadata: Metadata = {
  title: "Histórico do contribuinte — Gertor de Alertas",
};

export default async function HistoricoPage({
  params,
}: PageProps<"/app/contribuintes/[id]/historico">) {
  const { id } = await params;
  const registros = await getHistoricoRegime(id);
  return <HistoricoCadastralTab dados={{ colunas: HISTORICO_COLUNAS, registros }} />;
}
