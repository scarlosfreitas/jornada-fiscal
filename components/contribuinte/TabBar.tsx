"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { CONTRIBUINTE_TABS, contribuinteTab } from "@/lib/routes";
import { TAB_META } from "./tab-meta";

/**
 * A aba ativa vem do segmento de rota abaixo do layout da ficha. Um layout
 * servidor não enxerga os próprios segmentos filhos — useSelectedLayoutSegment
 * é a via documentada para isso, e por ela este componente é de cliente.
 */
export function TabBar({ id }: { id: string }) {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="ga-tabbar">
      {CONTRIBUINTE_TABS.map((tab) => {
        const isActive = tab === segment;
        return (
          <Link
            key={tab}
            href={contribuinteTab(id, tab)}
            className={`ga-tab${isActive ? " is-active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {TAB_META[tab].label}
          </Link>
        );
      })}
    </div>
  );
}
