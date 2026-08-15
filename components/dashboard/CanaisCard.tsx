import type { ChannelRow } from "@/lib/mock/dashboard";

function chipClass(variant: ChannelRow["chipVariant"]) {
  return variant ? `ga-chip ga-chip-${variant}` : "ga-chip";
}

export function CanaisCard({ channels, periodLabel }: { channels: ChannelRow[]; periodLabel: string }) {
  return (
    <div className="ga-card">
      <div className="ga-card-head">
        <div className="ga-stack-2" style={{ gap: 2 }}>
          <span className="ga-card-title">Canais de comunicação</span>
          <span className="ga-caption">Entregas por canal · {periodLabel}</span>
        </div>
      </div>
      <div className="ga-card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--ga-space-4)" }}>
        {channels.map((channel) => (
          <div key={channel.label} className="ga-stack-2" style={{ gap: 8 }}>
            <div className="ga-row-between">
              <span className="ga-row" style={{ gap: 10 }}>
                <span className={chipClass(channel.chipVariant)}>{channel.label}</span>
                <span className="ga-caption">{channel.hint}</span>
              </span>
              <span className="ga-mono" style={{ fontWeight: 500, color: "var(--ga-gray-700)" }}>
                {channel.value}
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: "var(--ga-gray-100)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  borderRadius: 999,
                  background: channel.color,
                  width: channel.pct,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
