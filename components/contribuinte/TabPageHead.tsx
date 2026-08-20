import type { ReactNode } from "react";
import { Download } from "lucide-react";
import type { ContribuinteTab } from "@/lib/routes";
import { TAB_META } from "./tab-meta";

interface TabPageHeadProps {
  tab: ContribuinteTab;
  /** Controles próprios da aba, exibidos antes do botão Exportar. */
  children?: ReactNode;
  /** Controles exibidos depois do botão Exportar (ex.: ação primária). */
  trailing?: ReactNode;
}

export function TabPageHead({ tab, children, trailing }: TabPageHeadProps) {
  const meta = TAB_META[tab];

  return (
    <div className="ga-page-head">
      <div className="ga-page-head-text">
        <div className="ga-breadcrumb">
          <span>Contribuinte</span>
          <span>/</span>
          <span className="is-current">{meta.crumb}</span>
        </div>
        <h1 className="ga-page-title">{meta.title}</h1>
        <span className="ga-page-subtitle">{meta.subtitle}</span>
      </div>
      <div className="ga-page-actions">
        {children}
        <button
          type="button"
          className="ga-btn ga-btn-secondary"
          disabled
          title="Exportação ainda não disponível"
        >
          <Download size={14} />
          Exportar
        </button>
        {trailing}
      </div>
    </div>
  );
}
