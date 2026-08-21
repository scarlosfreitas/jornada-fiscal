import type { Metadata } from "next";
import { getActions } from "@/lib/mock/ftm";
import { TiposAcaoTable } from "@/components/ftm/TiposAcaoTable";

export const metadata: Metadata = {
  title: "Tipos de Ação — Ontologia FtM — Gertor de Alertas",
};

export default function TipoAcaoPage() {
  const actions = getActions();

  return <TiposAcaoTable initialActions={actions} />;
}
