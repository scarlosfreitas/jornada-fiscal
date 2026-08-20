import { getContribuinteFicha } from "@/lib/mock/contribuinte-detalhe";
import { EntityBar } from "@/components/contribuinte/EntityBar";
import { TabBar } from "@/components/contribuinte/TabBar";

export default async function ContribuinteLayout({
  children,
  params,
}: LayoutProps<"/app/contribuintes/[id]">) {
  const { id } = await params;
  const ficha = getContribuinteFicha(id);

  return (
    <>
      <EntityBar ficha={ficha} />
      <TabBar id={id} />
      {children}
    </>
  );
}
