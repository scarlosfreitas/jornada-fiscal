import Link from "next/link";
import { LOGIN_ROUTE } from "@/lib/routes";
import { LogoIcon } from "@/components/icons/LogoIcon";
import { MENU, HERO_STATS, TIMELINE, TIMELINE_TAG_LABEL } from "@/lib/marketing/landing-content";
import styles from "../landing.module.css";

const LEVEL_CLASS: Record<string, string> = {
  gray: "ga-badge-neutral",
  yellow: "ga-badge-warning",
  red: "ga-badge-danger",
};

export function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.section} style={{ padding: "0 var(--ga-content-pad-x)" }}>
        <nav className={styles.nav}>
          <div className={styles.navBrand}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                flex: "none",
                background: "var(--ga-primary-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--ga-accent-500)",
              }}
            >
              <LogoIcon />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={{ font: "700 15px/1.2 var(--ga-font-display)", color: "var(--ga-white)" }}>
                Gertor de Alertas
              </span>
              <span
                className="ga-mono"
                style={{ font: "400 10.5px/1.2 var(--ga-font-mono)", color: "rgba(255,255,255,.45)" }}
              >
                inteligência fiscal
              </span>
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div className={styles.navLinks}>
            {MENU.map((item) => (
              <a key={item.href} href={item.href} className={styles.navLink}>
                {item.label}
              </a>
            ))}
            <Link href={LOGIN_ROUTE} className="ga-btn ga-btn-accent">
              Log in
            </Link>
          </div>
        </nav>

        <div className={styles.heroGrid}>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <span className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              Rastreio da jornada fiscal
            </span>
            <h1 className={styles.heroTitle}>
              O que antes passava invisível, agora está na tela: rastreio total da jornada fiscal.
            </h1>
            <p className={styles.heroLead}>
              Centralize sua análise com a nova timeline do contribuinte. Detecte alterações
              cadastrais instantaneamente, acompanhe a emissão de documentos sensíveis e gerencie
              ordens de serviço com fluidez.
            </p>
            <div className={styles.heroActions}>
              <Link href={LOGIN_ROUTE} className="ga-btn ga-btn-primary ga-btn-lg">
                Logar agora
              </Link>
              <a href="#timeline" className={styles.heroLinkGhost}>
                Ver a timeline
              </a>
            </div>
            <div className={styles.heroStats}>
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className={styles.heroStat}>
                  <span className={styles.heroStatValue}>{stat.value}</span>
                  <span className={styles.heroStatLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroPreview}>
            <div className={styles.heroPreviewCard}>
              <div className={styles.heroPreviewChrome}>
                <span className={styles.heroPreviewDot} />
                <span className={styles.heroPreviewDot} />
                <span className={styles.heroPreviewDot} />
                <span className={styles.heroPreviewLabel}>contribuinte · 12.884.310/0001-45</span>
              </div>
              <div className={styles.heroPreviewBody}>
                {TIMELINE.slice(0, 4).map((event) => (
                  <div key={event.title} className="ga-row" style={{ gap: 10 }}>
                    <span className="ga-caption ga-mono" style={{ width: 70, flex: "none" }}>
                      {event.date}
                    </span>
                    <span className="ga-body-sm" style={{ flex: 1 }}>
                      {event.title}
                    </span>
                    <span className={`ga-badge ${LEVEL_CLASS[event.level]}`}>
                      {TIMELINE_TAG_LABEL[event.level]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
