import type { Metadata } from "next";
import { getProperties, getSchemas } from "@/lib/mock/ftm";
import { PropriedadesTable } from "@/components/ftm/PropriedadesTable";

export const metadata: Metadata = {
  title: "Propriedades — Ontologia FtM — Gertor de Alertas",
};

export default function PropriedadesPage() {
  const schemas = getSchemas();
  const properties = getProperties();

  return <PropriedadesTable schemas={schemas} initialProperties={properties} />;
}
