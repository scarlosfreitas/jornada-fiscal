import Link from "next/link";
import type { FtmListConsumer } from "@/lib/mock/listas";
import { regraDetalhe } from "@/lib/routes";

export function ListaConsumidores({ consumers }: { consumers: FtmListConsumer[] }) {
  return (
    <div className="ga-card">
      <div className="ga-card-head">
        <div className="ga-stack-2" style={{ gap: 3 }}>
          <span className="ga-card-title">Regras consumidoras</span>
          <span className="ga-caption">Regras cuja condição referencia esta watchlist</span>
        </div>
      </div>
      <div className="ga-card-body">
        {consumers.length === 0 ? (
          <span className="ga-body-sm ga-muted">Nenhuma regra consome esta lista no momento.</span>
        ) : (
          <div className="ga-col" style={{ gap: 0 }}>
            {consumers.map((c) => (
              <div
                key={`${c.ruleCode}-${c.path}`}
                className="ga-row"
                style={{ gap: 14, padding: "10px 0", borderBottom: "1px solid var(--ga-border-subtle)" }}
              >
                <Link href={regraDetalhe(c.ruleCode)} className="ga-mono" style={{ fontWeight: 500, flex: "none" }}>
                  {c.ruleCode}
                </Link>
                <span className="ga-mono ga-caption ga-grow">{c.path}</span>
                <span className="ga-chip ga-mono">{c.operator}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
