import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLista } from "@/lib/mock/listas";
import { ListaEditor } from "@/components/listas/ListaEditor";

export async function generateMetadata({
  params,
}: PageProps<"/app/alertas/[codigo]">): Promise<Metadata> {
  const { codigo } = await params;
  const lista = getLista(codigo);
  return { title: lista ? `${lista.code} — Gertor de Alertas` : "Lista não encontrada — Gertor de Alertas" };
}

export default async function ListaDetalhePage({ params }: PageProps<"/app/alertas/[codigo]">) {
  const { codigo } = await params;
  const lista = getLista(codigo);
  if (!lista) notFound();

  return <ListaEditor lista={lista} />;
}
