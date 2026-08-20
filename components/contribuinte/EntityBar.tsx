import type { ContribuinteFicha } from "@/lib/mock/contribuinte-detalhe";

export function EntityBar({ ficha }: { ficha: ContribuinteFicha }) {
  return (
    <div className="ga-entity-bar">
      <div className="ga-entity-avatar">{ficha.iniciais}</div>
      <div className="ga-stack-2" style={{ gap: 4, minWidth: 0 }}>
        <span className="ga-entity-name">{ficha.razaoSocial}</span>
        <span className="ga-entity-meta">
          CNPJ {ficha.cnpj} · IE {ficha.ie} · Grupo {ficha.grupoEconomico}
        </span>
      </div>
      <div className="ga-grow" />
      <div className="ga-row" style={{ gap: 10 }}>
        {ficha.badges.map((badge) => (
          <span key={badge.label} className={`ga-badge ga-badge-${badge.variant}`}>
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  );
}
