import type { FtmRuleVersion } from "@/lib/mock/regras";

export function HistoricoVersoes({ versions }: { versions: FtmRuleVersion[] }) {
  return (
    <div className="ga-card">
      <div className="ga-card-head">
        <div className="ga-stack-2" style={{ gap: 3 }}>
          <span className="ga-card-title">Histórico de versões</span>
          <span className="ga-caption">ftm_rule_definition · vigência por versão</span>
        </div>
      </div>
      <div className="ga-card-body ga-col" style={{ gap: 0 }}>
        {versions.length === 0 && (
          <span className="ga-body-sm ga-muted">Regra ainda na primeira versão, sem histórico anterior.</span>
        )}
        {versions.map((v) => (
          <div
            key={v.version}
            className="ga-row"
            style={{ gap: 14, padding: "10px 0", borderBottom: "1px solid var(--ga-border-subtle)" }}
          >
            <span className="ga-chip ga-mono" style={{ flex: "none" }}>
              v{v.version}
            </span>
            <span className="ga-mono ga-grow" style={{ color: "var(--ga-gray-700)" }}>
              {v.range}
            </span>
            <span className="ga-caption">{v.author}</span>
            {v.vigente && <span className="ga-badge ga-badge-success">Em vigor</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
