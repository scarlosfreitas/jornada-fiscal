# fontes/

Payloads da camada de API de integração (SATE) usados como fixture enquanto a API
não existe, e como origem da carga inicial do banco (PRD, seção 5).

## O conteúdo desta pasta não é versionado

O `.gitignore` ignora tudo aqui exceto este README:

```
/fontes/*
!/fontes/README.md
```

**Este repositório é público.** Os payloads trazem dado real de contribuinte —
CNPJ, razão social, endereço, sócios, valores declarados, recolhimentos — protegido
por sigilo fiscal (CTN art. 198). Nada desta pasta pode ser commitado, nem com
`git add -f`.

Se um arquivo daqui entrar no histórico, remover no commit seguinte **não resolve**:
o dado continua acessível em qualquer clone e no histórico do GitHub. O tratamento
passa a ser reescrita de histórico e comunicação do incidente.

## Onde guardar de fato

O leitor resolve o diretório por `FONTES_DIR` no `.env` (que também é ignorado),
com esta pasta como padrão:

```bash
FONTES_DIR="/home/seu-usuario/dados-jornada-fiscal"
```

**Preferir um diretório fora da árvore do repositório.** É o que elimina de vez a
chance de um `git add` distraído ou de uma alteração futura no `.gitignore` publicar
os arquivos. `./fontes` existe como conveniência para quem aceitar esse risco.

## Contrato

A estrutura dos payloads — endpoints, campos, tipos — é documentada em
`references/api/`, com exemplos **anonimizados** que podem ser versionados. É de lá
que saem os tipos em `lib/api/contracts.ts`.

Ao acrescentar um payload novo aqui, atualize o contrato lá.

## Ausência é suportada

`lib/fontes/` cai de volta nos mocks fictícios de `lib/mock/*` quando o arquivo
esperado não existe. O projeto builda e roda sem esta pasta — quem clonar o repo
não precisa dos dados reais para trabalhar.
