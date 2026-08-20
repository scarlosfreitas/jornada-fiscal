import type { Metadata } from "next";
import { getRecolhimentos } from "@/lib/mock/contribuinte-detalhe";
import { RecolhimentosTab } from "@/components/contribuinte/RecolhimentosTab";

export const metadata: Metadata = {
  title: "Recolhimentos — Gertor de Alertas",
};

export default async function RecolhimentosPage({
  params,
}: PageProps<"/app/contribuintes/[id]/recolhimentos">) {
  const { id } = await params;
  return <RecolhimentosTab tabela={await getRecolhimentos(id)} />;
}
