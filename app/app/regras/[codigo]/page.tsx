import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRegra } from "@/lib/mock/regras";
import { RegraEditor } from "@/components/regras/RegraEditor";

export async function generateMetadata({
  params,
}: PageProps<"/app/regras/[codigo]">): Promise<Metadata> {
  const { codigo } = await params;
  const regra = getRegra(codigo);
  return { title: regra ? `${regra.code} — Gertor de Alertas` : "Regra não encontrada — Gertor de Alertas" };
}

export default async function RegraDetalhePage({ params }: PageProps<"/app/regras/[codigo]">) {
  const { codigo } = await params;
  const regra = getRegra(codigo);
  if (!regra) notFound();

  return <RegraEditor regra={regra} />;
}
