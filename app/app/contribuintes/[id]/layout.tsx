import { auth } from "@/auth";
import { getInstituicao } from "@/lib/sate-instituicao";
import { registrarAcessoContribuinte } from "@/lib/consulta-entidade";
import { EntityBar } from "@/components/contribuinte/EntityBar";
import { TabBar } from "@/components/contribuinte/TabBar";
import type { ContribuinteBadge } from "@/lib/mock/contribuinte-detalhe";

const BADGES_PLACEHOLDER: ContribuinteBadge[] = [
  { label: "Situação ativa", variant: "success" },
  { label: "2 alertas abertos", variant: "danger" },
  { label: "Regime: lucro presumido", variant: "neutral" },
];

function extrairIniciais(razaoSocial: string): string {
  const limpo = razaoSocial.trim();
  if (!limpo) return "--";
  const palavras = limpo.split(/\s+/).filter(Boolean);
  if (palavras.length >= 2) {
    return (palavras[0][0] + palavras[1][0]).toUpperCase();
  }
  return limpo.slice(0, 2).toUpperCase();
}

function formatarCpfCnpj(doc?: string | null): string {
  if (!doc) return "—";
  const limpo = doc.replace(/\D/g, "");
  if (limpo.length === 14) {
    return `${limpo.slice(0, 2)}.${limpo.slice(2, 5)}.${limpo.slice(5, 8)}/${limpo.slice(8, 12)}-${limpo.slice(12)}`;
  }
  if (limpo.length === 11) {
    return `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.${limpo.slice(6, 9)}-${limpo.slice(9)}`;
  }
  return doc;
}

function formatarIe(ie?: string | null): string {
  if (!ie) return "—";
  const limpo = ie.replace(/\D/g, "");
  if (limpo.length === 9) {
    return `${limpo.slice(0, 2)}.${limpo.slice(2, 5)}.${limpo.slice(5, 8)}-${limpo.slice(8)}`;
  }
  const grupos = ie.match(/.{1,3}/g) ?? [ie];
  return grupos.join(".");
}

export default async function ContribuinteLayout({
  children,
  params,
}: LayoutProps<"/app/contribuintes/[id]">) {
  const { id } = await params;
  const instituicao = await getInstituicao(id);

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

  if (!instituicao) {
    return (
      <div className="ga-card" style={{ padding: "32px 24px", textAlign: "center" }}>
        <p className="ga-body ga-muted">Contribuinte não encontrado</p>
      </div>
    );
  }

  const razaoSocial = instituicao.razao_social ?? "—";
  const iniciais = extrairIniciais(razaoSocial);

  return (
    <>
      <EntityBar
        razaoSocial={razaoSocial}
        nomeFantasia={instituicao.cad_nome_fantasia ?? instituicao.nome_fantasia}
        cpfCnpj={formatarCpfCnpj(instituicao.cad_cnpj ?? instituicao.cad_cpf ?? instituicao.cpf_cnpj)}
        inscricaoEstadual={formatarIe(instituicao.cad_ie ?? instituicao.inscricao_estadual)}
        iniciais={iniciais}
        badges={BADGES_PLACEHOLDER}
      />
      <TabBar id={id} />
      {children}
    </>
  );
}
