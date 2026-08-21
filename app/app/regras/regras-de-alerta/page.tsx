import type { Metadata } from "next";
import { getRegras } from "@/lib/mock/regras";
import { RegrasTable } from "@/components/regras/RegrasTable";

export const metadata: Metadata = {
  title: "Regras de alerta — Gertor de Alertas",
};

export default function RegrasDeAlertaPage() {
  const regras = getRegras();

  return <RegrasTable regras={regras} />;
}
