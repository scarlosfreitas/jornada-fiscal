import styles from "../landing.module.css";

export function CtaFooter() {
  return (
    <div style={{ borderTop: "1px solid var(--ga-border)" }}>
      <div className={styles.section} style={{ padding: "64px var(--ga-content-pad-x) 40px" }}>
        <div className={styles.ctaRow}>
          <div className={styles.ctaText}>
            <span className={styles.ctaTitle}>Veja a jornada fiscal com poucos cliques</span>
            <span className={styles.ctaSubtitle}>
              O que antes demandava diversas telas, agora tudo está a poucos cliques.
            </span>
          </div>
          <button type="button" className="ga-btn ga-btn-primary ga-btn-lg">
            Visualizar demonstração
          </button>
        </div>
      </div>

      <div className={styles.footerRow}>
        <span className={styles.footerCopy}>
          © 2026 Gertor de Alertas · CNPJ 41.882.104/0001-30 · Todos os direitos reservados
        </span>
        <div className={styles.footerLinks}>
          <a href="#termos" className={styles.footerLink}>
            Termos de uso
          </a>
          <a href="#privacidade" className={styles.footerLink}>
            Política de privacidade
          </a>
        </div>
      </div>
    </div>
  );
}
