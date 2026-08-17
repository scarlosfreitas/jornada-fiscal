import { OPS_CARDS } from "@/lib/marketing/landing-content";
import styles from "../landing.module.css";

const TONE_COLOR: Record<(typeof OPS_CARDS)[number]["tone"], string> = {
  primary: "var(--ga-primary-600)",
  info: "var(--ga-info)",
  success: "var(--ga-success)",
  warning: "var(--ga-warning)",
};

const NODES = [
  { cx: 552, cy: 72, label: "NFe", stroke: "var(--ga-primary-600)" },
  { cx: 316, cy: 60, label: "Vistoria", stroke: "var(--ga-accent-500)" },
  { cx: 132, cy: 170, label: "TIF", stroke: "var(--ga-primary-200)" },
  { cx: 206, cy: 340, label: "MDFe", stroke: "var(--ga-primary-200)" },
  { cx: 474, cy: 392, label: "Auto de Infração", stroke: "var(--ga-danger-bd)" },
  { cx: 524, cy: 244, label: "Notificação", stroke: "var(--ga-primary-200)" },
];

export function OperacoesConjuntas() {
  return (
    <div id="operacoes" className={styles.section} style={{ background: "var(--ga-surface)" }}>
      <div className={styles.opsGrid}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span className={styles.eyebrow}>Gestão de operações conjuntas</span>
          <h2 className={styles.heading}>Operações de vistoria acompanhadas de ponta a ponta</h2>
          <p className="ga-body" style={{ color: "var(--ga-gray-600)" }}>
            Acompanhamento de operações de vistoria em trânsito e em estabelecimento —
            solicitação, delegação, efetivação e conclusão registradas na mesma ordem de serviço.
          </p>
          <div className={styles.opsCardsGrid}>
            {OPS_CARDS.map((card) => (
              <div key={card.label} className={styles.opsCard}>
                <span className={styles.opsCardValue} style={{ color: TONE_COLOR[card.tone] }}>
                  {card.value}
                </span>
                <span className={styles.opsCardLabel}>{card.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.opsGraph}>
          <svg viewBox="0 0 720 460" width="100%" height="100%" role="img" aria-label="Grafo de vínculos do contribuinte">
            <g stroke="rgba(26,30,40,0.18)" strokeWidth="1.5">
              {NODES.map((node) => (
                <line key={node.label} x1="360" y1="230" x2={node.cx} y2={node.cy} />
              ))}
            </g>
            <circle cx="360" cy="230" r="52" fill="var(--ga-primary-600)" stroke="var(--ga-accent-500)" strokeWidth="2" />
            <text x="360" y="235" textAnchor="middle" fill="var(--ga-white)" fontFamily="var(--ga-font-display)" fontSize="15" fontWeight="600">
              Contribuinte
            </text>
            {NODES.map((node) => (
              <g key={node.label}>
                <circle cx={node.cx} cy={node.cy} r="22" fill="var(--ga-white)" stroke={node.stroke} strokeWidth="2" />
                <text
                  x={node.cx}
                  y={node.cy - 36}
                  textAnchor="middle"
                  fill="var(--ga-gray-700)"
                  fontFamily="var(--ga-font-body)"
                  fontSize="13"
                  fontWeight="500"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
