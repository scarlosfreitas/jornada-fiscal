"use client";

import { useState } from "react";
import { schemaById, type FtmProperty, type FtmSchema } from "@/lib/mock/ftm";
import { EntidadesTable } from "./EntidadesTable";
import { EntidadeDetalhe } from "./EntidadeDetalhe";

type NatureTab = "todos" | "ent" | "edge";

export function EntidadesScreen({
  schemas,
  initialProperties,
}: {
  schemas: FtmSchema[];
  initialProperties: FtmProperty[];
}) {
  const [properties, setProperties] = useState<FtmProperty[]>(initialProperties);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<NatureTab>("todos");
  const [menuId, setMenuId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  if (editId !== null) {
    const schema = schemaById(editId);
    if (schema) {
      return (
        <EntidadeDetalhe
          schema={schema}
          allSchemas={schemas}
          properties={properties}
          onPropertiesChange={setProperties}
          onBack={() => setEditId(null)}
        />
      );
    }
  }

  return (
    <EntidadesTable
      schemas={schemas}
      properties={properties}
      query={query}
      onQuery={setQuery}
      tab={tab}
      onTab={setTab}
      menuId={menuId}
      onMenuChange={setMenuId}
      onOpenDetail={setEditId}
    />
  );
}
