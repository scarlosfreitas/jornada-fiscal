import { auth } from "@/auth";
import { getContribuinteFicha } from "@/lib/mock/contribuinte-detalhe";
import { registrarAcessoContribuinte } from "@/lib/consulta-entidade";
import { EntityBar } from "@/components/contribuinte/EntityBar";
import { TabBar } from "@/components/contribuinte/TabBar";

export default async function ContribuinteLayout({
  children,
  params,
}: LayoutProps<"/app/contribuintes/[id]">) {
  const { id } = await params;
  const ficha = await getContribuinteFicha(id);

  const session = await auth();
  if (session?.user?.id) {
    try {
      // Falha ao registrar não pode impedir a apresentação da ficha (spec:
      // "Falha ao registrar o acesso").
      await registrarAcessoContribuinte(session.user.id, id);
    } catch (erro) {
      console.error("[consulta-entidade] falha ao registrar acesso ao contribuinte:", erro);
    }
  }

  return (
    <>
      <EntityBar ficha={ficha} />
      <TabBar id={id} />
      {children}
    </>
  );
}
