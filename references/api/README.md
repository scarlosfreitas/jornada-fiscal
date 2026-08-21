# Contrato da API de integração (SATE)

Formato dos payloads que a camada de API de integração devolve. Essa camada é um
projeto separado (PRD, seção 7: *"a camada de API de integração com o sistema
corporativo (SATE) — desenvolvida em projeto separado; este protótipo assume que os
dados já chegam por essa camada"*), então aqui se documenta o que ela entrega, não
como ela é construída.

## Divisão entre contrato e dado

| | Onde | Versionado |
|---|---|---|
| Estrutura + exemplo **anonimizado** | esta pasta | sim |
| Payloads **reais** | `FONTES_DIR` (padrão `fontes/`) | **não** |
| Tipos TypeScript | `lib/api/contracts.ts` | sim |
| Leitor server-only | `lib/fontes/index.ts` | sim |

Este repositório é público. Os payloads reais trazem dado de contribuinte protegido
por sigilo fiscal (CTN art. 198) e nunca entram aqui — ver `fontes/README.md`.

**Todo exemplo nesta pasta é anonimizado**: mesma estrutura (chaves, tipos,
cardinalidade, formato dos campos), com CNPJ, inscrição estadual, razão social,
endereço, nomes de sócios e contadores e valores substituídos por dados inventados.
Um exemplo com CNPJ real não é exemplo, é vazamento.

## Como acrescentar um payload

1. Copie um registro do arquivo real e **substitua todo campo identificável**.
   Preserve o formato (máscara do CNPJ, casas decimais, formato de data) — é o que
   o contrato precisa comunicar.
2. Salve como `<nome>.exemplo.json` nesta pasta, com `<nome>` igual ao do arquivo
   que o leitor procura em `FONTES_DIR` (`lerFonte("<nome>")` lê `<nome>.json`).
3. Descreva o payload na tabela abaixo: origem, quando é atualizado, e o que cada
   campo não óbvio significa.
4. Declare os tipos em `lib/api/contracts.ts` e o mapeamento para os tipos de
   apresentação de `lib/mock/*`.

## Payloads

| Arquivo (`FONTES_DIR`) | Exemplo | Conteúdo | Tipo |
|---|---|---|---|
| _(a preencher)_ | | | |

## Divergências conhecidas

Quando o payload real divergir do que as telas esperam — campo faltando, nome
diferente, unidade diferente — registre aqui em vez de silenciar no mapper. As
telas de hoje foram construídas a partir dos protótipos de `references/design/`, e
divergências entre eles e a API são esperadas.
