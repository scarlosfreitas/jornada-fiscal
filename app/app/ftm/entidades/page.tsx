import type { Metadata } from "next";
import { getProperties, getSchemas } from "@/lib/mock/ftm";
import { EntidadesScreen } from "@/components/ftm/EntidadesScreen";

export const metadata: Metadata = {
  title: "Entidades — Ontologia FtM — Gertor de Alertas",
};

export default function EntidadesPage() {
  const schemas = getSchemas();
  const properties = getProperties();

  return <EntidadesScreen schemas={schemas} initialProperties={properties} />;
}
