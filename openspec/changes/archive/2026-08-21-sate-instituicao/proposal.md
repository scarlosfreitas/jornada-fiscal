## Why

A página do contribuinte (`/app/contribuintes/[id]`) exibe dados de identidade e situação cadastral a partir de dados fictícios (mock). A fonte real já está disponível na view `analytics.sate_instituicao`, e é necessário conectar a entity bar e a aba de situação cadastral a essa fonte. Além disso, os links da sidebar para as sub-páginas do contribuinte apontam para rotas estáticas (sem `[id]`), levando todas à mesma tela em vez de navegar para cada aba específica do contribuinte aberto.

## What Changes

- Criar `lib/sate-instituicao.ts` — módulo server-only que consulta `analytics.sate_instituicao` via SQL bruto parametrizado (mesmo padrão de `lib/consulta-entidade.ts`), filtrando por `id_contribuinte`.
- Alterar o layout `app/app/contribuintes/[id]/layout.tsx` para obter os dados da entity bar a partir de `sate_instituicao` em vez de `getContribuinteFicha` (mock).
- Alterar `components/contribuinte/EntityBar.tsx` para receber os campos vindos de `sate_instituicao` (`razao_social`, `nome_fantasia`, `cpf_cnpj`, `inscricao_estadual`) em vez da interface `ContribuinteFicha` do mock.
- Alterar `app/app/contribuintes/[id]/situacao-cadastral/page.tsx` para buscar de `sate_instituicao` e exibir os campos: `tipo`, `situacao_cadastral`, `dt_situacao_cadastral`, `motivo_situacao_cadastral`, `ind_atividade`.
- Corrigir as rotas do grupo Contribuinte em `lib/routes.ts` para serem funções parametrizadas por `id`, e atualizar `components/layout/nav-data.ts` e a sidebar para gerar links dinâmicos (`/app/contribuintes/[id]/<aba>`).

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `contribuinte-ficha`: A entity bar e a aba Situação Cadastral passam a obter dados de `analytics.sate_instituicao` em vez de dados fictícios; a entity bar recebe props com a nova forma de dados.
- `dashboard-shell`: Os links do grupo Contribuinte na sidebar passam a ser dinâmicos, incluindo o `[id]` do contribuinte aberto, para navegar à aba correta.

## Impact

- **Código afetado**: `lib/routes.ts`, `components/layout/nav-data.ts`, `components/layout/Sidebar.tsx`, `components/contribuinte/EntityBar.tsx`, `app/app/contribuintes/[id]/layout.tsx`, `app/app/contribuintes/[id]/situacao-cadastral/page.tsx`.
- **Novo módulo**: `lib/sate-instituicao.ts` (acesso à view analítica via Prisma `$queryRaw`).
- **Dependência de infra**: A view `analytics.sate_instituicao` deve existir no banco; ambientes sem ela devem degradar graciosamente (mesmo padrão do `consulta-entidade`).
- **Sem breaking changes de API** — tudo é interno ao frontend server-side.
