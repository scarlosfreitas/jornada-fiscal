import type { Metadata } from "next";
import { getValoresDeclarados } from "@/lib/mock/contribuinte-detalhe";
import { ValoresDeclaradosTab } from "@/components/contribuinte/ValoresDeclaradosTab";

export const metadata: Metadata = {
  title: "Valores declarados — Gertor de Alertas",
};

export default async function ValoresDeclaradosPage({
  params,
}: PageProps<"/app/contribuintes/[id]/valores-declarados">) {
  const { id } = await params;
  return <ValoresDeclaradosTab dados={await getValoresDeclarados(id)} />;
}
