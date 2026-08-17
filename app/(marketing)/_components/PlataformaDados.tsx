import { PIPELINE, PLATFORM_NOTES } from "@/lib/marketing/landing-content";
import styles from "../landing.module.css";

export function PlataformaDados() {
  return (
    <div id="plataforma" className={`${styles.section} ${styles.sectionDark}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 760, marginBottom: 44 }}>
        <span className={`${styles.eyebrow} ${styles.eyebrowOnDark}`}>Plataforma de dados</span>
        <h2 className={`${styles.heading} ${styles.headingOnDark}`}>
          Acoplado a uma plataforma de dados moderna e independente
        </h2>
      </div>

      <div className={styles.pipelineCard}>
        <div className={styles.pipelineTrack}>
          {PIPELINE.map((step, index) => (
            <div key={step.name} className={styles.pipelineStep}>
              <div className={`${styles.pipelineNode} ${step.accent ? styles.pipelineNodeAccent : ""}`}>
                <span className={`${styles.pipelineStage} ${step.accent ? styles.pipelineStageAccent : ""}`}>
                  {step.stage}
                </span>
                <span className={styles.pipelineName}>{step.name}</span>
                <span className={styles.pipelineRole}>{step.role}</span>
              </div>
              {index < PIPELINE.length - 1 && (
                <div className={styles.pipelineArrow}>
                  <div className={styles.pipelineArrowLine}>
                    <div className={styles.pipelineArrowHead} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.platformNotes}>
          {PLATFORM_NOTES.map((note) => (
            <span key={note} className={styles.platformNote}>
              <span className={styles.platformNoteDot} />
              {note}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
