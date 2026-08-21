import type { ContribuinteBadge } from "@/lib/mock/contribuinte-detalhe";

export interface EntityBarProps {
  razaoSocial: string;
  nomeFantasia?: string | null;
  cpfCnpj: string;
  inscricaoEstadual: string;
  iniciais: string;
  badges: ContribuinteBadge[];
}

export function EntityBar({
  razaoSocial,
  nomeFantasia,
  cpfCnpj,
  inscricaoEstadual,
  iniciais,
  badges,
}: EntityBarProps) {
  const metaParts = [`CNPJ ${cpfCnpj}`, `IE ${inscricaoEstadual}`];
  if (nomeFantasia && nomeFantasia.trim() !== "") {
    metaParts.push(nomeFantasia);
  }

  return (
    <div className="ga-entity-bar">
      <div className="ga-entity-avatar">{iniciais}</div>
      <div className="ga-stack-2" style={{ gap: 4, minWidth: 0 }}>
        <span className="ga-entity-name">{razaoSocial}</span>
        <span className="ga-entity-meta">{metaParts.join(" · ")}</span>
      </div>
      <div className="ga-grow" />
      <div className="ga-row" style={{ gap: 10 }}>
        {badges.map((badge) => (
          <span key={badge.label} className={`ga-badge ga-badge-${badge.variant}`}>
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  );
}
