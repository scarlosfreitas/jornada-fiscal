"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, FileText, TriangleAlert } from "lucide-react";
import type { LinhaDoTempo } from "@/lib/mock/contribuinte-detalhe";
import { CATEGORIAS } from "./categorias";
import { TAB_META } from "./tab-meta";
import { TabPageHead } from "./TabPageHead";
import { SearchInput } from "./SearchInput";
import { PhotoViewer } from "./PhotoViewer";

export function LinhaDoTempoTab({ dados }: { dados: LinhaDoTempo }) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const eventos = dados.eventos.filter(
    (e) => q === "" || `${e.date} ${e.title} ${e.doc ?? ""}`.toLowerCase().includes(q),
  );

  return (
    <>
      <TabPageHead
        tab="linha-do-tempo"
        trailing={
          <button
            type="button"
            className="ga-btn ga-btn-primary"
            onClick={() => toast("Cadastro de evento no histórico — a compor.")}
          >
            <Plus size={14} />
            Adicionar evento
          </button>
        }
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={TAB_META["linha-do-tempo"].searchPlaceholder}
        />
      </TabPageHead>

      <div className="ga-card" style={{ padding: "26px 28px 30px" }}>
        {eventos.length === 0 ? (
          <div className="ga-body-sm ga-muted">Nenhum evento encontrado.</div>
        ) : (
          <div className="ga-timeline">
            {eventos.map((e, i) => {
              const categoria = e.categoria ? CATEGORIAS[e.categoria] : null;
              const dotColor = e.today ? "#12855C" : e.future ? "#E8A317" : (categoria?.dot ?? "#151A2E");
              const dotCls = e.today ? " ga-dot-today" : e.future ? " ga-dot-future" : "";
              const lineCls = e.today || e.future ? " ga-line-dashed" : "";
              const dateCls = e.today ? " ga-date-today" : e.future ? " ga-date-future" : "";
              const titleCls = e.today ? " ga-title-today" : "";

              return (
                <div className="ga-timeline-row" key={`${e.date}-${e.title}-${i}`}>
                  <div className={`ga-timeline-date${dateCls}`}>{e.date}</div>
                  <div className="ga-timeline-rail">
                    <div className={`ga-timeline-dot${dotCls}`} style={{ borderColor: dotColor }} />
                    <div className={`ga-timeline-line${lineCls}`} />
                  </div>
                  <div className="ga-timeline-body">
                    <div className="ga-row ga-wrap" style={{ gap: 10 }}>
                      <span className={`ga-timeline-title${titleCls}`}>{e.title}</span>
                      {categoria && (
                        <span
                          className={`ga-chip${categoria.chipVariant ? ` ga-chip-${categoria.chipVariant}` : ""}`}
                        >
                          {categoria.label}
                        </span>
                      )}
                      {e.warning && (
                        <span className="ga-chip ga-chip-warning ga-row" style={{ gap: 7 }}>
                          <TriangleAlert size={13} style={{ flex: "none" }} />
                          {e.warning}
                        </span>
                      )}
                    </div>
                    {e.doc && (
                      <button
                        type="button"
                        className="ga-doc-link"
                        onClick={() => toast(`Abrindo ${e.doc} — visualizador a compor.`)}
                      >
                        <FileText size={12} />
                        Abrir PDF · {e.doc}
                      </button>
                    )}
                    {e.photos && <PhotoViewer fotos={dados.fotos} />}
                    {e.transcript && (
                      <div className="ga-quote">
                        <div className="ga-row-between">
                          <span className="ga-overline">Transcrição da conversa</span>
                          <span
                            className={`ga-badge ${e.sigilo === "restrito" ? "ga-badge-danger" : "ga-badge-neutral"}`}
                          >
                            Sigilo {e.sigilo ?? "geral"}
                          </span>
                        </div>
                        <p className="ga-body" style={{ color: "var(--ga-gray-700)" }}>
                          {dados.transcricao}
                        </p>
                        <span className="ga-caption ga-mono">{dados.transcricaoMeta}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
