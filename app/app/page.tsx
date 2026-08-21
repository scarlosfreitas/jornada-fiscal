import type { Metadata } from "next";
import { getDashboardData, parsePeriod } from "@/lib/mock/dashboard";
import { PainelOperacional } from "@/components/dashboard/PainelOperacional";
import { UltimosAlertasTable } from "@/components/dashboard/UltimosAlertasTable";
import { MonitoramentosAtivosTable } from "@/components/dashboard/MonitoramentosAtivosTable";

export const metadata: Metadata = {
  title: "Painel operacional — Gertor de Alertas",
};

export default async function DashboardPage({ searchParams }: PageProps<"/app">) {
  const { periodo } = await searchParams;
  const period = parsePeriod(periodo);
  const data = getDashboardData(period);

  return (
    <PainelOperacional period={period} data={data}>
      <UltimosAlertasTable alerts={data.recentAlerts} updatedLabel={data.updatedLabel} />
      <MonitoramentosAtivosTable monitorings={data.activeMonitorings} />
    </PainelOperacional>
  );
}
