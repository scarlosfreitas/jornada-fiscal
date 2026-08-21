## Why

A aba Histórico da ficha do contribuinte (`/app/contribuintes/[id]/historico`) ainda exibe dados fictícios de `lib/mock/contribuinte-detalhe.ts`. A fonte real já está no banco analítico, na view `analytics.sate_hist_regime` (403.719 linhas, 82.774 contribuintes), com uma linha por intervalo de vigência cadastral — exatamente o que a aba precisa mostrar.

Além disso, os links do grupo Contribuinte na barra lateral só funcionam dentro de uma ficha aberta. Fora dela apontam para rotas estáticas como `/app/contribuintes/historico`, que casam com a rota dinâmica `[id]` e redirecionam para a linha do tempo — por isso todos os subitens acabam na mesma tela. Pior: depois do redirecionamento a URL vira `/app/contribuintes/historico/linha-do-tempo`, e a sidebar passa a tratar `"historico"` como se fosse um `id` de contribuinte.

## What Changes

- Criar `lib/sate-hist-regime.ts` — módulo server-only que consulta `analytics.sate_hist_regime` filtrando por `cad_id`, seguindo o padrão já estabelecido em `lib/sate-instituicao.ts` (SQL parametrizado via Prisma `$queryRaw`, degradação graciosa quando a view não existe).
- Alterar `app/app/contribuintes/[id]/historico/page.tsx` para obter os registros de `sate_hist_regime` em vez de `getHistoricoCadastral` (mock).
- Acrescentar a coluna **Município** à tabela do histórico, formada por `cad_municipio` e `cad_uf`.
- **BREAKING (interno)**: as colunas Data início e Data fim passam a vir de `cad_hist_ini` e `cad_hist_fim` — as colunas `cad_data_ini`/`cad_data_fim` citadas no pedido não existem em nenhuma relação do schema `analytics`; `cad_hist_ini`/`cad_hist_fim` são os nomes reais na view e já são os usados pelo mock atual.
- Corrigir o grupo Contribuinte da barra lateral: sem contribuinte aberto, os sete subitens ficam inertes (sem link) e acionar o item pai "Contribuinte" abre a caixa de busca da barra superior já com os contribuintes recentes, como se a pessoa tivesse focado o próprio campo de busca.
- Remover das rotas estáticas do Contribuinte (`ROUTES.contribuinte*`) o papel de destino navegável, incluindo as entradas correspondentes na busca de funcionalidade da barra lateral (`APP_FEATURES`), que hoje levam ao mesmo beco.

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `contribuinte-ficha`: a aba Histórico passa a obter os registros de `analytics.sate_hist_regime` em vez de dados fictícios, e ganha a coluna Município (`cad_municipio` + `cad_uf`); o requisito passa a fixar a origem e o mapeamento de cada coluna.
- `dashboard-shell`: os subitens do grupo Contribuinte deixam de manter links estáticos quando nenhuma ficha está aberta — passam a ficar inertes, e acionar o item pai abre a busca de contribuinte da barra superior.

## Impact

- **Novo módulo**: `lib/sate-hist-regime.ts` (acesso à view analítica via Prisma `$queryRaw`).
- **Código afetado**: `app/app/contribuintes/[id]/historico/page.tsx`, `components/contribuinte/HistoricoCadastralTab.tsx`, `components/layout/Sidebar.tsx`, `components/layout/Topbar.tsx`, `components/layout/nav-data.ts`, `lib/routes.ts`, `app/app/layout.tsx`, `lib/mock/contribuinte-detalhe.ts`.
- **Estado compartilhado novo**: abrir a busca da barra superior a partir da barra lateral exige um ponto de coordenação entre `Sidebar` e `Topbar`, que hoje são irmãos sem estado em comum (ver design.md).
- **Dependência de infra**: a view `analytics.sate_hist_regime` deve existir no banco; ambientes sem ela degradam graciosamente, como já ocorre com `analytics.sate_instituicao`.
- **Sem breaking change de API pública** — tudo é interno ao frontend server-side.
