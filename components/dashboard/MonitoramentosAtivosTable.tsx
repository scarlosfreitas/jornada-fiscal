import Link from "next/link";
import type { MonitoringRow } from "@/lib/mock/dashboard";

export function MonitoramentosAtivosTable({ monitorings }: { monitorings: MonitoringRow[] }) {
  return (
    <div className="ga-table-wrap">
      <div className="ga-table-toolbar">
        <div className="ga-stack-2" style={{ gap: 2 }}>
          <span className="ga-card-title">Monitoramentos ativos</span>
          <span className="ga-caption">Com OS de intervenção em aberto</span>
        </div>
        <Link href="/monitoramento" className="ga-body-sm">
          Ver monitoramentos
        </Link>
      </div>
      <table className="ga-table">
        <thead>
          <tr>
            <th style={{ width: 120 }}>Código</th>
            <th>Descrição</th>
            <th style={{ width: 130 }}>Nível</th>
            <th style={{ width: 76, textAlign: "right" }}>OS</th>
          </tr>
        </thead>
        <tbody>
          {monitorings.map((monitoring) => (
            <tr key={monitoring.code}>
              <td>
                <span className="ga-mono" style={{ fontWeight: 500, color: "var(--ga-primary-600)" }}>
                  {monitoring.code}
                </span>
              </td>
              <td>
                <span className="ga-stack-2" style={{ gap: 2, minWidth: 0 }}>
                  <span className="ga-cell-primary ga-truncate">{monitoring.desc}</span>
                  <span className="ga-cell-meta ga-truncate">{monitoring.scope}</span>
                </span>
              </td>
              <td>
                <span className={`ga-level ${monitoring.levelClass}`}>{monitoring.level}</span>
              </td>
              <td className="ga-table-num">{monitoring.osCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
