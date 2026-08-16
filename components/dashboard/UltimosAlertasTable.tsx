import Link from "next/link";
import type { AlertRow } from "@/lib/mock/dashboard";
import { ROUTES, regraDetalhe } from "@/lib/routes";

export function UltimosAlertasTable({ alerts, updatedLabel }: { alerts: AlertRow[]; updatedLabel: string }) {
  return (
    <div className="ga-table-wrap">
      <div className="ga-table-toolbar">
        <div className="ga-stack-2" style={{ gap: 2 }}>
          <span className="ga-card-title">Últimos alertas gerados</span>
          <span className="ga-caption">Fila em tempo real · {updatedLabel}</span>
        </div>
        <Link href={ROUTES.alertasGerados} className="ga-body-sm">
          Ver todos
        </Link>
      </div>
      <table className="ga-table">
        <thead>
          <tr>
            <th style={{ width: 96 }}>Hora</th>
            <th style={{ width: 150 }}>Tipo</th>
            <th>Alvo</th>
            <th style={{ width: 120 }}>Regra</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, i) => (
            <tr key={`${alert.ruleCode}-${alert.time}-${i}`}>
              <td className="ga-mono ga-muted">{alert.time}</td>
              <td>
                <span className={`ga-level ${alert.levelClass}`}>{alert.level}</span>
              </td>
              <td>
                <span className="ga-stack-2" style={{ gap: 2, minWidth: 0 }}>
                  <span className="ga-cell-primary ga-truncate">{alert.name}</span>
                  <span className="ga-cell-meta ga-truncate">{alert.doc}</span>
                </span>
              </td>
              <td>
                <Link href={regraDetalhe(alert.ruleCode)} className="ga-mono">
                  {alert.ruleCode}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
