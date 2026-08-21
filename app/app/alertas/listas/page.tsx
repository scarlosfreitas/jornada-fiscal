import type { Metadata } from "next";
import { getListas } from "@/lib/mock/listas";
import { ListasTable } from "@/components/listas/ListasTable";

export const metadata: Metadata = {
  title: "Listas — Gertor de Alertas",
};

export default function ListasPage() {
  const listas = getListas();

  return <ListasTable listas={listas} />;
}
