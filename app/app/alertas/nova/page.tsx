import type { Metadata } from "next";
import { createListaDraft } from "@/lib/mock/listas";
import { ListaEditor } from "@/components/listas/ListaEditor";

export const metadata: Metadata = {
  title: "Nova lista — Gertor de Alertas",
};

export default function NovaListaPage() {
  return <ListaEditor lista={createListaDraft()} isNew />;
}
