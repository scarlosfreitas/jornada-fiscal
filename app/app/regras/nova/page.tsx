import type { Metadata } from "next";
import { createRegraDraft } from "@/lib/mock/regras";
import { RegraEditor } from "@/components/regras/RegraEditor";

export const metadata: Metadata = {
  title: "Nova regra — Gertor de Alertas",
};

export default function NovaRegraPage() {
  return <RegraEditor regra={createRegraDraft()} isNew />;
}
