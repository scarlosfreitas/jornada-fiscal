import type { Metadata } from "next";
import { Hero } from "./_components/Hero";
import { RegrasAviso } from "./_components/RegrasAviso";
import { TimelineContribuinte } from "./_components/TimelineContribuinte";
import { PlataformaDados } from "./_components/PlataformaDados";
import { OperacoesConjuntas } from "./_components/OperacoesConjuntas";
import { CtaFooter } from "./_components/CtaFooter";

export const metadata: Metadata = {
  title: "Gertor de Alertas — inteligência fiscal",
  description: "Rastreio da jornada fiscal: regras de aviso, timeline do contribuinte, plataforma de dados e operações conjuntas.",
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <RegrasAviso />
      <TimelineContribuinte />
      <PlataformaDados />
      <OperacoesConjuntas />
      <CtaFooter />
    </>
  );
}
