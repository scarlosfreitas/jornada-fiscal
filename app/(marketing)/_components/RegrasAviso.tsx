import { SOURCES } from "@/lib/marketing/landing-content";
import styles from "../landing.module.css";

export function RegrasAviso() {
  return (
    <div id="regras" className={`${styles.section} ${styles.sectionBordered}`} style={{ background: "var(--ga-surface)" }}>
      <div className={styles.sectionHead}>
        <div className={styles.sectionHeadText}>
          <span className={styles.eyebrow}>Regras de aviso</span>
          <h2 className={styles.heading}>
            Alerta em tempo real sobre diversos eventos que antes passavam desapercebidos
          </h2>
        </div>
        <span className={styles.sectionAside}>
          Cada fonte alimenta a régua de avisos: indicação em tela, alerta no Telegram ou ordem de
          intervenção.
        </span>
      </div>

      <div className={styles.sourceGrid}>
        {SOURCES.map((source) => (
          <div key={source.tag} className="ga-card ga-card-hover">
            <div className="ga-card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className={`${styles.sourceIcon} ga-chip-primary`}>{source.tag}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span className="ga-card-title">{source.title}</span>
                <span className="ga-body-sm ga-muted">{source.desc}</span>
              </div>
              <div className="ga-row ga-wrap" style={{ gap: 6 }}>
                {source.chips.map((chip) => (
                  <span key={chip} className="ga-chip">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
