import type { ComponentType } from "react";
import { BellIcon } from "@/components/icons/BellIcon";
import { MonitoramentoIcon } from "@/components/icons/MonitoramentoIcon";
import { OrdensServicoIcon } from "@/components/icons/OrdensServicoIcon";
import { CheckIcon } from "@/components/icons/CheckIcon";
import type { IconProps } from "@/components/icons/types";
import type { KpiCard, KpiVariant } from "@/lib/mock/dashboard";

const KPI_ICON: Record<KpiVariant, ComponentType<IconProps>> = {
  primary: BellIcon,
  warning: MonitoramentoIcon,
  danger: OrdensServicoIcon,
  success: CheckIcon,
};

export function KpiGrid({ kpis }: { kpis: KpiCard[] }) {
  return (
    <div className="ga-kpi-grid" style={{ marginBottom: "var(--ga-space-5)" }}>
      {kpis.map((kpi) => {
        const Icon = KPI_ICON[kpi.variant];
        return (
          <div key={kpi.label} className={`ga-kpi ga-kpi-${kpi.variant}`}>
            <div className="ga-row-between">
              <span className="ga-kpi-label">{kpi.label}</span>
              <Icon style={{ width: 18, height: 18, opacity: 0.75 }} />
            </div>
            <span className="ga-kpi-value">{kpi.value}</span>
            <span className="ga-kpi-delta">{kpi.delta}</span>
          </div>
        );
      })}
    </div>
  );
}
