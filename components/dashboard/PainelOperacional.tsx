"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDashboardData, type Period } from "@/lib/mock/dashboard";
import { ROUTES } from "@/lib/routes";
import { PageHead } from "./PageHead";
import { KpiGrid } from "./KpiGrid";
import { CanaisCard } from "./CanaisCard";
import { AlertasPorDiaChart } from "./charts/AlertasPorDiaChart";
import { OsPorSituacaoChart } from "./charts/OsPorSituacaoChart";
import { RegrasQueMaisDisparamChart } from "./charts/RegrasQueMaisDisparamChart";

const LEGEND = [
  { label: "Alerta", color: "#C2321F" },
  { label: "Indicação", color: "#E8A317" },
  { label: "Intervenção", color: "#8A91A3" },
];

export function PainelOperacional({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("7d");
  const data = getDashboardData(period);

  return (
    <>
      <PageHead period={period} onPeriodChange={setPeriod} onRefresh={() => router.refresh()} />

      <KpiGrid kpis={data.kpis} />

      <div style={{ display: "grid", gridTemplateColumns: "1.9fr 1fr", gap: "var(--ga-space-5)", marginBottom: "var(--ga-space-5)" }}>
        <div className="ga-card">
          <div className="ga-card-head">
            <div className="ga-stack-2" style={{ gap: 2 }}>
              <span className="ga-card-title">Alertas gerados por dia</span>
              <span className="ga-caption">Por nível de monitoramento · {data.periodLabel}</span>
            </div>
            <div className="ga-row" style={{ gap: 14 }}>
              {LEGEND.map((item) => (
                <span key={item.label} className="ga-row" style={{ gap: 7 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: item.color }} />
                  <span className="ga-body-sm ga-muted">{item.label}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="ga-card-body" style={{ height: 280 }}>
            <AlertasPorDiaChart data={data.alertsByLevel} />
          </div>
        </div>

        <div className="ga-card">
          <div className="ga-card-head">
            <div className="ga-stack-2" style={{ gap: 2 }}>
              <span className="ga-card-title">OS de intervenção</span>
              <span className="ga-caption">Distribuição por situação</span>
            </div>
          </div>
          <div className="ga-card-body" style={{ height: 280 }}>
            <OsPorSituacaoChart data={data.osDistribution} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "var(--ga-space-5)", marginBottom: "var(--ga-space-5)" }}>
        <div className="ga-card">
          <div className="ga-card-head">
            <div className="ga-stack-2" style={{ gap: 2 }}>
              <span className="ga-card-title">Regras que mais disparam</span>
              <span className="ga-caption">Alertas emitidos {data.periodLabel}</span>
            </div>
            <Link href={ROUTES.regrasDeAlerta} className="ga-body-sm">
              Ver regras
            </Link>
          </div>
          <div className="ga-card-body" style={{ height: 260 }}>
            <RegrasQueMaisDisparamChart data={data.topRules} />
          </div>
        </div>

        <CanaisCard channels={data.channels} periodLabel={data.periodLabel} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "var(--ga-space-5)" }}>
        {children}
      </div>
    </>
  );
}
