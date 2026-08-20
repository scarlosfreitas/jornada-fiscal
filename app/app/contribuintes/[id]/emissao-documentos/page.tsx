import type { Metadata } from "next";
import { getDocumentosEmitidos } from "@/lib/mock/contribuinte-detalhe";
import { EmissaoDocumentosTab } from "@/components/contribuinte/EmissaoDocumentosTab";

export const metadata: Metadata = {
  title: "Emissão de documentos — Gertor de Alertas",
};

export default async function EmissaoDocumentosPage({
  params,
}: PageProps<"/app/contribuintes/[id]/emissao-documentos">) {
  const { id } = await params;
  return <EmissaoDocumentosTab tabela={await getDocumentosEmitidos(id)} />;
}
