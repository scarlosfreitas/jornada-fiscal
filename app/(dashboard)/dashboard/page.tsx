import type { Metadata } from "next";
import { getDashboardData } from "@/lib/mock/dashboard";
import { PainelOperacional } from "@/components/dashboard/PainelOperacional";
import { UltimosAlertasTable } from "@/components/dashboard/UltimosAlertasTable";
import { MonitoramentosAtivosTable } from "@/components/dashboard/MonitoramentosAtivosTable";

export const metadata: Metadata = {
  title: "Painel operacional — Gertor de Alertas",
};

export default function DashboardPage() {
  const { recentAlerts, activeMonitorings, updatedLabel } = getDashboardData("7d");

  return (
    <PainelOperacional>
      <UltimosAlertasTable alerts={recentAlerts} updatedLabel={updatedLabel} />
      <MonitoramentosAtivosTable monitorings={activeMonitorings} />
    </PainelOperacional>
  );
}
