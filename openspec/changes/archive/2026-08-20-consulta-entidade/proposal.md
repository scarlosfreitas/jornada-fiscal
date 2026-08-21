## Why

A busca de contribuinte da barra superior ainda roda sobre `lib/mock/contribuintes.ts` — oito registros fictícios (ou o payload `fontes/contribuintes.json`) filtrados em memória. O banco já expõe `analytics.consulta_entidade`, com ~400 mil entidades reais, coluna gerada `search_index` (unaccent + lower sobre CNPJ, CPF, IE, nome, razão social e nome fantasia) e índice GIN `pg_trgm` — exatamente a estrutura que viabiliza busca textual em tempo real. Ligar a caixa de busca a essa tabela transforma o campo do protótipo na porta de entrada real da jornada fiscal: digitar qualquer fragmento de identificação e chegar à ficha do contribuinte.

## What Changes

- A busca da barra superior passa a consultar `analytics.consulta_entidade` em vez do mock, casando o texto digitado contra a coluna `search_index`.
- A busca aceita CNPJ, CPF, inscrição estadual, nome, razão social e nome fantasia, com comportamento "estilo Google": acentos e caixa ignorados, pontuação de documentos ignorada, múltiplos termos combinados por E (todos precisam casar), casamento parcial em qualquer posição e resultados ordenados por relevância.
- **BREAKING** (nível de spec): sócio e contador deixam de ser critérios de busca — a fonte real não os expõe. Em troca entram CPF, IE e nome fantasia.
- Cada resultado exibe razão social como título, "CNPJ · IE" como subtítulo e badge de situação cadastral. Enquanto a tabela de origem não trouxer a situação, o badge SHALL ser sempre "Ativo" (decisão do produto; a origem será alterada depois).
- Acionar um resultado navega para `/app/contribuintes/<cad_id>`, a ficha do contribuinte.
- Com o campo vazio, o dropdown lista os contribuintes recentes reais da pessoa usuária: as últimas fichas que ela abriu, registradas quando a ficha é aberta e persistidas por usuário.
- A consulta continua sendo executada no servidor, exigindo sessão autenticada — a base de contribuintes nunca trafega inteira para o navegador (sigilo fiscal).

## Capabilities

### New Capabilities

- `consulta-entidade`: a busca de entidade sobre `analytics.consulta_entidade` — como o texto digitado é interpretado e normalizado, o que é comparado, como os resultados são ordenados e limitados, o que cada resultado carrega, o registro e a listagem dos contribuintes recentes por usuário, e o controle de acesso da consulta.

### Modified Capabilities

- `dashboard-shell`: o requisito "Busca de contribuinte na barra superior" muda de critérios (sócio/contador saem; CPF, IE e nome fantasia entram), de estado vazio (recentes reais da pessoa usuária, não uma lista fixa) e de badge (sempre "Ativo" até a origem trazer situação cadastral).

## Impact

- **Banco (leitura)**: `analytics.consulta_entidade` — tabela já existente, somente leitura; nenhuma migração a criar sobre ela. Depende do índice `idx_consulta_entidade_search_trgm` e da coluna gerada `search_index`.
- **Banco (escrita)**: novo modelo Prisma + migração para o histórico de fichas abertas por usuário (schema `public`, convenções de auditoria já adotadas em `prisma/schema.prisma`).
- **Código**: `components/layout/Topbar.tsx` (dropdown e placeholder), `app/app/actions.ts` (server action de busca), novo módulo de consulta em `lib/`, `app/app/contribuintes/[id]/layout.tsx` (registro de acesso), `lib/routes.ts` se necessário.
- **Mock**: `lib/mock/contribuintes.ts` deixa de alimentar a barra superior. A ficha do contribuinte continua servida pelos dados atuais — ligar a ficha à base real está fora do escopo desta change.
- **Sem novas dependências**: consulta via `prisma.$queryRaw` com SQL parametrizado.
