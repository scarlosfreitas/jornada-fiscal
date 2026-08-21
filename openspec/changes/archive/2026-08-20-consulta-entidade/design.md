## Context

Ver `proposal.md` — Why. O que molda o desenho:

- `analytics.consulta_entidade` já existe no banco de desenvolvimento com **399.886 linhas**: `cad_id bigint PK`, `cnpj/cpf/ie/nome/razao_social/nome_fantasia varchar`, `search_index text GENERATED ALWAYS AS (f_unaccent(lower(coalesce(cnpj,'')||' '||coalesce(cpf,'')||' '||coalesce(ie,'')||' '||coalesce(nome,'')||' '||coalesce(razao_social,'')||' '||coalesce(nome_fantasia,''))))`, `updated_at timestamptz`. Índices: GIN `gin_trgm_ops` sobre `search_index`, e btree parcial sobre `cnpj`, `cpf` e `ie`.
- Os documentos estão **sem máscara** (`05985502000132`, `030000306`). Preenchimento: cnpj 399.404, cpf 475, ie 82.775, nome/razao_social 399.886, nome_fantasia 65.999 — ou seja, IE é minoritária e nome fantasia falta em 5 de 6 linhas.
- A tabela está fora do `schema=public` do `DATABASE_URL` e não é modelada no `prisma/schema.prisma` (que não usa `multiSchema`). É base analítica de leitura, alimentada por fora da aplicação.
- A busca já roda no servidor via server action (`app/app/actions.ts`), com debounce de 250 ms e descarte de resposta fora de ordem na `Topbar`. Essa mecânica se mantém; muda a fonte.
- A ficha do contribuinte (`getContribuinteFicha`) hoje ignora o `id` e devolve sempre a mesma ficha. Navegar por `cad_id` funciona sem quebrar nada; ligar a ficha à base real é outra change.

Medições feitas no banco de desenvolvimento (400k linhas, `LIMIT 10`):

| consulta | tempo |
| --- | --- |
| `search_index LIKE '%mer%'` (índice GIN) | 1 ms |
| dois termos combinados por `AND` | 6–13 ms |
| termo de 2 caracteres (`'%me%'`) — GIN não cobre | 185 ms |
| termo comum (`'%ltda%'`) com `ORDER BY similarity` sobre todos os casamentos | 909 ms |
| termo curto (`'%mer%'`) com `ORDER BY similarity` sobre todos os casamentos | 1.286 ms |
| mesmo termo comum com candidatos limitados a 500 antes de ordenar | 189 ms |
| igualdade exata em `cnpj`/`cpf`/`ie` | 2–17 ms |

## Goals / Non-Goals

**Goals:**

- Consulta que responde dentro do orçamento de digitação contínua (< ~200 ms no pior caso medido) sobre as 400k linhas, sem varredura sequencial.
- Um único caminho de consulta para documento e para texto, para que a pessoa auditora não precise escolher o "tipo" de busca.
- Histórico de fichas abertas por usuário persistido no banco da aplicação, seguindo as convenções já estabelecidas em `prisma/schema.prisma`.

**Non-Goals:**

- Modelar `analytics.consulta_entidade` no Prisma ou habilitar `multiSchema`.
- Alimentar, sincronizar ou migrar a tabela analítica — ela é populada por fora.
- Ligar a ficha do contribuinte (abas, dados) à base real.
- Busca por sócio ou contador; ranking com aprendizado, sinônimos ou correção ortográfica.

## Decisions

### 1. Consulta por SQL bruto parametrizado, não por modelo Prisma

`prisma.$queryRaw` com placeholders, encapsulado num módulo `lib/consulta-entidade.ts` marcado `import "server-only"` (mesmo padrão de `lib/mock/contribuintes.ts`).

*Por quê:* a tabela vive em outro schema, é somente leitura e a consulta precisa de `similarity()`, `LIKE` sobre coluna gerada e um subselect com limite de candidatos — nada disso o Prisma Client expressa. Modelá-la exigiria `previewFeatures = ["multiSchema"]`, `@@schema` em **todos** os models existentes e uma migração que o Prisma tentaria gerenciar sobre uma tabela que não é dele.

*Alternativas:* (a) `multiSchema` + model Prisma — descartada pelo custo acima e pelo risco de o Prisma "corrigir" a tabela analítica numa migração futura; (b) view materializada no schema `public` — duplicaria 400k linhas sem ganho.

### 2. Três faixas de casamento numa consulta só

O texto digitado vira duas formas: `digitos` (só os dígitos) e `termos` (normalizado, dividido por espaço, termos com menos de 3 caracteres descartados).

1. **Documento exato** — quando `digitos` tem 11 ou 14 caracteres (CPF/CNPJ) ou o texto normalizado casa com o formato de IE: igualdade contra `cnpj`, `cpf` e `ie`, usando os btree parciais. Sempre presente no resultado, independente do limite de candidatos.
2. **Prefixo** — `search_index LIKE '<texto>%'`, ordenado antes das demais.
3. **Contém** — `search_index LIKE '%termo%'` para cada termo, combinados por `AND`; ordenado por `similarity(search_index, <texto>)`.

*Por quê:* dá o comportamento "Google" pedido (fragmentos em qualquer posição, ordem livre de termos, tolerância a acento e máscara) sem abrir mão de que um CNPJ colado inteiro caia no topo. O `AND` de `LIKE '%x%'` é resolvido pelo GIN como interseção de bitmaps (confirmado no `EXPLAIN`: `Bitmap Index Scan on idx_consulta_entidade_search_trgm`, 6 ms).

*Alternativa:* `tsvector`/`websearch_to_tsquery` — descartada: full-text lexicaliza palavras inteiras e não encontra fragmento no meio de um documento numérico, que é metade do caso de uso. O índice existente também já é trigram.

### 3. Limite de candidatos antes de ordenar por semelhança

A faixa "contém" seleciona no máximo **500** candidatos (`LIMIT` no subselect, sem ordenação) e só então ordena por `similarity` e corta em 10.

*Por quê:* ordenar por `similarity` sobre **todos** os casamentos de um termo comum custa ~0,9–1,3 s; com o teto de 500 candidatos cai para ~190 ms no pior caso medido, e para 12 ms nos casos típicos. A perda é de qualidade de ranking apenas para textos muito genéricos ("ltda"), onde qualquer ordenação é arbitrária de todo modo — e a faixa 1 garante que o caso preciso (documento colado) nunca é afetado. É a aproximação declarada no spec ("subconjunto limitado").

*Alternativa:* ordenar tudo — descartada pelo custo; consulta a cada tecla precisa caber no orçamento de digitação.

### 4. Termos com menos de 3 caracteres são descartados

Trigram não cobre padrões com menos de 3 caracteres: `LIKE '%me%'` degrada para varredura (185 ms só para achar 10 linhas, muito pior com ordenação).

*Consequência aceita:* digitar `me` não busca nada até o terceiro caractere — o dropdown segue mostrando os recentes. Quando o texto é um documento, a faixa 1 continua valendo mesmo com poucos caracteres restantes após a divisão por termos.

### 5. Recentes: tabela própria no schema `public`, um registro por (usuário, entidade)

Novo model Prisma `ContribuinteAcesso` → tabela `contribuinte_acesso`, com chave primária composta `(usr_id, cad_id)`, `acessado_em timestamptz`, e o bloco de auditoria adotado no schema (`criado_por`, `atualizado_por`, `criado_em`, `atualizado_em`, `deletado_em`), com as FKs de auditoria em `NoAction` como nas demais tabelas. Índice `(usr_id, acessado_em DESC)`.

A abertura da ficha faz um `upsert` por essa chave, atualizando `acessado_em`. Ele roda em `app/app/contribuintes/[id]/layout.tsx`, que é o único ponto por onde todas as sete abas passam, e a falha é engolida (log, sem propagar) — o spec exige que a ficha apareça mesmo assim.

*Por quê a chave composta:* "a mesma entidade nunca aparece duas vezes entre os recentes" vira invariante do banco em vez de regra de leitura.

*Por que `cad_id` como referência sem FK:* a entidade vive em `analytics`, num schema que o Prisma não gerencia; uma FK entre schemas acoplaria a migração da aplicação à carga analítica. O `cad_id` é guardado como `BigInt` e, na leitura dos recentes, as entidades correspondentes são buscadas em `analytics.consulta_entidade`; `cad_id` que não existe mais simplesmente não aparece.

*Alternativa:* guardar os recentes em cookie/`localStorage` — descartada: seria por navegador, não por pessoa, e colocaria identificação de contribuinte no cliente, contra o cuidado de sigilo já adotado.

### 6. Formatação de máscara e nome de exibição na camada de leitura

`cnpj`, `cpf` e `ie` chegam sem máscara e são formatados ao montar o resultado; o nome de exibição aplica a cascata `razao_social → nome → nome_fantasia`; a linha "CNPJ · IE" omite ausentes sem deixar separador.

*Por quê:* mantém a `Topbar` como componente de apresentação puro, recebendo o mesmo formato `ContribuinteResult` que já consome — o diff no componente fica restrito a placeholder, títulos do dropdown e estado vazio.

### 7. Badge fixo em "Ativo"

A base analítica não expõe situação cadastral. Decisão do produto: emitir sempre `Ativo`/`success`, num único ponto do código com comentário apontando que a origem passará a trazer a situação. Quando a coluna existir, muda-se esse ponto e o cenário correspondente do spec.

## Risks / Trade-offs

- **Ranking pobre para textos muito genéricos** (efeito do teto de 500 candidatos) → mitigado por: documento exato e prefixo não passam pelo teto; na prática o texto genérico é refinado com mais um termo, que derruba o conjunto de casamentos.
- **`analytics.consulta_entidade` pode não existir no ambiente de quem clonou o repositório** → a consulta trata a ausência da relação como "sem resultados" e registra o motivo no log do servidor, em vez de derrubar a barra superior em toda navegação. É o mesmo espírito do fallback de `lib/fontes`.
- **`cad_id` é `bigint` e não sobrevive a `JSON.stringify`** → convertido para `string` na fronteira do módulo de leitura; o restante do código só vê `string`, que é o que a rota `/app/contribuintes/[id]` já espera.
- **Dado real sob sigilo fiscal na base analítica** → a server action continua exigindo sessão (`auth()`), o módulo de consulta é `server-only`, e só os ≤10 resultados da consulta corrente trafegam. Nenhum log inclui documento ou razão social.
- **`updated_at` da base analítica pode ficar defasado** → fora do escopo; a busca reflete o que a carga analítica entregou.
- **Migração nova sobre banco já migrado** → a tabela é aditiva, não toca em nada existente; o rollback é dropar a tabela.

## Migration Plan

1. Adicionar o model `ContribuinteAcesso` ao `prisma/schema.prisma` e gerar a migração (`prisma migrate dev`), que cria apenas a tabela nova.
2. Publicar o código; a busca passa a consultar `analytics.consulta_entidade` imediatamente.
3. Os recentes começam vazios para todas as pessoas usuárias e se preenchem conforme fichas são abertas — sem carga inicial.

**Rollback:** reverter o código restaura a busca sobre `lib/mock/contribuintes.ts`; a tabela `contribuinte_acesso` pode permanecer (inerte) ou ser dropada. Nada em `analytics` é alterado em nenhum momento.
