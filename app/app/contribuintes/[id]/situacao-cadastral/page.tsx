import type { Metadata } from "next";
import { getContribuinteFicha, getSituacaoCadastral } from "@/lib/mock/contribuinte-detalhe";
import { SituacaoCadastralTab } from "@/components/contribuinte/SituacaoCadastralTab";

export const metadata: Metadata = {
  title: "Situação atual — Gertor de Alertas",
};

export default async function SituacaoCadastralPage({
  params,
}: PageProps<"/app/contribuintes/[id]/situacao-cadastral">) {
  const { id } = await params;
  return <SituacaoCadastralTab campos={getSituacaoCadastral(id)} ficha={getContribuinteFicha(id)} />;
}
