interface CargoVigente {
  nome: string;
  efetivo: boolean;
}

interface VinculoCargo {
  vigenciaInicio: Date;
  cargo: CargoVigente;
}

// Regra de negócio (dashboard-shell spec): o cargo comissionado vigente mais
// recente tem precedência; na ausência de comissionado, usa o efetivo
// vigente. `vinculos` já deve vir filtrado só pelos vigentes (vigenciaFim
// null) — esta função não filtra por vigência, apenas resolve a precedência.
export function cargoVigente(vinculos: VinculoCargo[]): string | null {
  const comissionados = vinculos.filter((vinculo) => !vinculo.cargo.efetivo);
  if (comissionados.length > 0) {
    const maisRecente = comissionados.reduce((atual, candidato) =>
      candidato.vigenciaInicio > atual.vigenciaInicio ? candidato : atual,
    );
    return maisRecente.cargo.nome;
  }

  const efetivo = vinculos.find((vinculo) => vinculo.cargo.efetivo);
  return efetivo?.cargo.nome ?? null;
}
