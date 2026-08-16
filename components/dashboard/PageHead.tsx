import { Download, RefreshCw } from "lucide-react";
import type { Period } from "@/lib/mock/dashboard";

interface PageHeadProps {
  period: Period;
  onPeriodChange: (period: Period) => void;
  onRefresh: () => void;
}

export function PageHead({ period, onPeriodChange, onRefresh }: PageHeadProps) {
  return (
    <div className="ga-page-head">
      <div className="ga-page-head-text">
        <div className="ga-breadcrumb">
          <span>Operações</span>
          <span>/</span>
          <span className="is-current">Painel</span>
        </div>
        <h1 className="ga-page-title">Painel operacional</h1>
        <span className="ga-page-subtitle">
          Visão consolidada de alertas, monitoramentos e ordens de serviço
        </span>
      </div>
      <div className="ga-page-actions">
        <select
          className="ga-select"
          value={period}
          onChange={(e) => onPeriodChange(e.target.value as Period)}
        >
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="90d">Últimos 90 dias</option>
        </select>
        <button
          type="button"
          className="ga-btn ga-btn-secondary"
          disabled
          title="Exportação ainda não disponível"
        >
          <Download size={14} />
          Exportar
        </button>
        <button type="button" className="ga-btn ga-btn-primary" onClick={onRefresh}>
          <RefreshCw size={14} />
          Atualizar
        </button>
      </div>
    </div>
  );
}
