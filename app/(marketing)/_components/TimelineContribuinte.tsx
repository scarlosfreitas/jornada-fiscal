import { TIMELINE, TIMELINE_TAG_LABEL, TIMELINE_BULLETS } from "@/lib/marketing/landing-content";
import styles from "../landing.module.css";

const LEVEL_CLASS: Record<string, string> = {
  gray: "ga-badge-neutral",
  yellow: "ga-badge-warning",
  red: "ga-badge-danger",
};

export function TimelineContribuinte() {
  return (
    <div id="timeline" className={`${styles.section} ${styles.sectionBordered}`}>
      <div className={styles.timelineGrid}>
        <div className="ga-card">
          <div className="ga-card-body">
            <div className={styles.timelineCardHead}>
              <span className="ga-card-title">Metalúrgica Andrade S/A</span>
              <span className="ga-caption ga-mono">16 eventos · 2020–2026</span>
            </div>
            <div className="ga-timeline">
              {TIMELINE.map((event, index) => (
                <div key={event.title} className="ga-timeline-row">
                  <span className="ga-timeline-date">{event.date}</span>
                  <div className="ga-timeline-rail">
                    <span className="ga-timeline-dot" />
                    {index < TIMELINE.length - 1 && <span className="ga-timeline-line" />}
                  </div>
                  <div className="ga-timeline-body">
                    <div className="ga-row ga-wrap" style={{ gap: 9 }}>
                      <span className="ga-timeline-title">{event.title}</span>
                      <span className={`ga-badge ${LEVEL_CLASS[event.level]}`}>
                        {TIMELINE_TAG_LABEL[event.level]}
                      </span>
                    </div>
                    {event.doc && (
                      <span className="ga-doc-link">
                        <span
                          style={{
                            width: 10,
                            height: 13,
                            border: "1.5px solid currentColor",
                            borderRadius: 2,
                            flex: "none",
                          }}
                        />
                        {event.doc}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span className={styles.eyebrow}>Linha do tempo do contribuinte</span>
          <h2 className={styles.heading}>Toda a jornada do contribuinte em uma única tela</h2>
          <p className="ga-body" style={{ color: "var(--ga-gray-600)" }}>
            Acompanhamento dos diversos eventos que ocorrem para um contribuinte, vistos
            individualmente ou em conjunto, sem precisar navegar sobre diversas telas.
          </p>
          <div className={styles.timelineBullets}>
            {TIMELINE_BULLETS.map((bullet) => (
              <div key={bullet} className={styles.timelineBullet}>
                <span className={styles.timelineBulletIcon}>
                  <span className={styles.timelineBulletIconDot} />
                </span>
                <span className="ga-body" style={{ color: "var(--ga-gray-700)" }}>
                  {bullet}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
