import { Bell, Activity, ClipboardList, Check, type LucideIcon } from "lucide-react";
import type { KpiCard, KpiVariant } from "@/lib/mock/dashboard";

const KPI_ICON: Record<KpiVariant, LucideIcon> = {
  primary: Bell,
  warning: Activity,
  danger: ClipboardList,
  success: Check,
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
