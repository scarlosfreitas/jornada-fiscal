import type { Metadata } from "next";
import { getInstituicao } from "@/lib/sate-instituicao";
import { SituacaoCadastralTab } from "@/components/contribuinte/SituacaoCadastralTab";
import type { CampoCadastral } from "@/lib/mock/contribuinte-detalhe";

export const metadata: Metadata = {
  title: "Situação atual — Gertor de Alertas",
};

function formatarCnpj(cnpj: string | null | undefined): string {
  if (!cnpj) return "—";
  const limpo = cnpj.replace(/\D/g, "");
  if (limpo.length === 14) {
    return `${limpo.slice(0, 2)}.${limpo.slice(2, 5)}.${limpo.slice(5, 8)}/${limpo.slice(8, 12)}-${limpo.slice(12)}`;
  }
  return cnpj;
}

function formatarCpf(cpf: string | null | undefined): string {
  if (!cpf) return "—";
  const limpo = cpf.replace(/\D/g, "");
  if (limpo.length === 11) {
    return `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.${limpo.slice(6, 9)}-${limpo.slice(9)}`;
  }
  return cpf;
}

function formatarIe(ie: string | null | undefined): string {
  if (!ie) return "—";
  const grupos = ie.match(/.{1,3}/g) ?? [ie];
  return grupos.join(".");
}

function formatarData(data: Date | string | null | undefined): string {
  if (!data) return "—";
  if (typeof data === "string" && data.includes("/")) return data;
  const d = new Date(data);
  if (Number.isNaN(d.getTime())) return String(data);
  return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function calcularTempoDecorrido(data: Date | string | null | undefined): string {
  if (!data) return "";
  const d = new Date(data);
  if (Number.isNaN(d.getTime())) return "";
  const hoje = new Date();
  let anos = hoje.getFullYear() - d.getUTCFullYear();
  let meses = hoje.getMonth() - d.getUTCMonth();
  if (meses < 0) {
    anos--;
    meses += 12;
  }
  if (anos < 0) return "";
  if (anos === 0 && meses === 0) return "neste mês";
  if (anos === 0) return `há ${meses} ${meses === 1 ? "mês" : "meses"}`;
  if (meses === 0) return `há ${anos} ${anos === 1 ? "ano" : "anos"}`;
  return `há ${anos} ${anos === 1 ? "ano" : "anos"} e ${meses} ${meses === 1 ? "mês" : "meses"}`;
}

function formatarMoeda(valor: number | string | null | undefined): string {
  if (valor === null || valor === undefined || valor === "") return "—";
  const num = Number(valor);
  if (Number.isNaN(num)) return String(valor);
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function SituacaoCadastralPage({
  params,
}: PageProps<"/app/contribuintes/[id]/situacao-cadastral">) {
  const { id } = await params;
  const instituicao = await getInstituicao(id);

  if (!instituicao) {
    return (
      <div className="ga-card" style={{ padding: "32px 24px", textAlign: "center" }}>
        <p className="ga-body ga-muted">Contribuinte não encontrado</p>
      </div>
    );
  }

  const campos: CampoCadastral[] = [
    {
      label: "CNPJ",
      value: formatarCnpj(instituicao.cad_cnpj),
      mono: true,
      since: "",
    },
    {
      label: "CPF",
      value: formatarCpf(instituicao.cad_cpf),
      mono: true,
      since: "",
    },
    {
      label: "NIRE",
      value: instituicao.cad_nire ?? "—",
      mono: true,
      since: "",
    },
    {
      label: "IE",
      value: formatarIe(instituicao.cad_ie),
      mono: true,
      since: "",
    },
    {
      label: "Razão Social",
      value: instituicao.cad_razao_social ?? instituicao.razao_social ?? "—",
      mono: false,
      since: "",
    },
    {
      label: "Nome Fantasia",
      value: instituicao.cad_nome_fantasia ?? instituicao.nome_fantasia ?? "—",
      mono: false,
      since: "",
    },
    {
      label: "Natureza Jurídica",
      value: instituicao.cad_nat_jur_nome ?? "—",
      mono: false,
      since: "",
    },
    {
      label: "Regime Estadual",
      value: instituicao.cad_reg_est_nome ?? "—",
      mono: false,
      since: "",
    },
    {
      label: "Regime Federal",
      value: instituicao.cad_reg_fed_nome ?? "—",
      mono: false,
      since: "",
    },
    {
      label: "Data de Abertura",
      value: formatarData(instituicao.cad_dt_inicio),
      mono: true,
      since: calcularTempoDecorrido(instituicao.cad_dt_inicio),
    },
    {
      label: "Estabelecimento",
      value: instituicao.cad_estab_nome ?? "—",
      mono: false,
      since: "",
    },
    {
      label: "Capital Social",
      value: formatarMoeda(instituicao.cad_capital_social),
      mono: true,
      since: "",
    },
  ];

  return <SituacaoCadastralTab campos={campos} />;
}
