import type { Metadata } from "next";
import { getAlertas } from "@/lib/mock/alertas";
import { AlertasTable } from "@/components/alertas/AlertasTable";

export const metadata: Metadata = {
  title: "Alertas gerados — Gertor de Alertas",
};

export default function AlertasGeradosPage() {
  const alertas = getAlertas();

  return (
    <>
      <div className="ga-page-head">
        <div className="ga-page-head-text">
          <div className="ga-breadcrumb">
            <span>Gestão de Alertas</span>
            <span>/</span>
            <span className="is-current">Alertas</span>
          </div>
          <h1 className="ga-page-title">Alertas gerados</h1>
          <span className="ga-page-subtitle">Lista de alertas gerados pelas regras de alerta</span>
        </div>
      </div>
      <AlertasTable alertas={alertas} />
    </>
  );
}
