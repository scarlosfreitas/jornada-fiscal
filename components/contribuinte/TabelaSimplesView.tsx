import type { ReactNode } from "react";
import type { TabelaSimples } from "@/lib/mock/contribuinte-detalhe";

interface TabelaSimplesViewProps {
  tabela: TabelaSimples;
  /** Linhas já filtradas pela busca da aba, quando houver. */
  rows?: TabelaSimples["rows"];
  /** Substantivo usado na contagem do rodapé. */
  unidade?: string;
  /** Barra acima da tabela, ex.: critérios em vigor. */
  toolbar?: ReactNode;
}

/** Tabela compartilhada por Recolhimentos, Entrega de declarações e Emissão de documentos. */
export function TabelaSimplesView({
  tabela,
  rows,
  unidade = "itens",
  toolbar,
}: TabelaSimplesViewProps) {
  const linhas = rows ?? tabela.rows;

  return (
    <div className="ga-table-wrap" style={{ minWidth: 1120 }}>
      {toolbar}
      <table className="ga-table ga-table-zebra">
        <thead>
          <tr>
            {tabela.columns.map((label, i) => (
              <th
                key={label}
                style={{ textAlign: i === 0 ? "left" : "right", width: i === 0 ? "220px" : "auto" }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((row) => (
            <tr key={row.code}>
              <td>
                <span className="ga-stack-2" style={{ gap: 2 }}>
                  <span className="ga-mono" style={{ fontWeight: 500, color: "var(--ga-primary-600)" }}>
                    {row.code}
                  </span>
                  <span className="ga-caption">{row.desc}</span>
                </span>
              </td>
              {row.cells.map((text, j) => (
                <td
                  key={`${row.code}-${j}`}
                  className="ga-table-num"
                  style={{
                    fontWeight: j >= 3 ? 500 : 400,
                    color: j >= 3 ? "var(--ga-gray-700)" : "var(--ga-gray-900)",
                  }}
                >
                  {text}
                  {row.sub?.[j] && <span className="ga-cell-sub">{row.sub[j]}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {linhas.length === 0 && (
        <div className="ga-body-sm ga-muted" style={{ padding: "24px 20px 26px" }}>
          Nenhum item encontrado.
        </div>
      )}
      <div className="ga-pagination">
        <span className="ga-pagination-info">
          Mostrando <strong>{linhas.length}</strong> de <strong>{tabela.rows.length}</strong>{" "}
          {unidade}
        </span>
      </div>
    </div>
  );
}
