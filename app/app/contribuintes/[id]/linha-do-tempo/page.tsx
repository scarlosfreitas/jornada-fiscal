import type { Metadata } from "next";
import { getLinhaDoTempo } from "@/lib/mock/contribuinte-detalhe";
import { LinhaDoTempoTab } from "@/components/contribuinte/LinhaDoTempoTab";

export const metadata: Metadata = {
  title: "Linha do tempo do contribuinte — Gertor de Alertas",
};

export default async function LinhaDoTempoPage({
  params,
}: PageProps<"/app/contribuintes/[id]/linha-do-tempo">) {
  const { id } = await params;
  return <LinhaDoTempoTab dados={getLinhaDoTempo(id)} />;
}
