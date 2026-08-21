## 1. Rotas

- [x] 1.1 Adicionar `listaDetalhe(codigo)` a `lib/routes.ts`, simétrica a `regraDetalhe(codigo)`.

## 2. Mock: Regras

- [x] 2.1 Criar `lib/mock/regras.ts` com os tipos `FtmRuleStatus`, `FtmSchemaTarget`, `FtmOperator`, `FtmConditionNode` (`all`/`any`/`not`/condição atômica), `FtmActionTrigger`, `FtmRuleVersion` e `FtmRule`, alinhados a `references/domain/data-model-regra.md` §5.
- [x] 2.2 Popular o catálogo de operadores (`OPERATORS`) e os caminhos de propriedade por schema-alvo (`PATHS_BY_SCHEMA`, com tipo de dado) transcritos de `OPS`/`PATHS` em `references/design/FtMRegras.html`.
- [x] 2.3 Popular as oito regras (código, nome, descrição, schema-alvo, prioridade, situação, árvore de condições, ações, versões) transcritas de `RULES`/`TREES`/`ACTIONS0`/`VERSIONS` em `references/design/FtMRegras.html`, conferindo que `NFE_0001`, `CAD_0002` e `DIMP_0003` batem com `references/domain/seed-regra.md` §10.
- [x] 2.4 Expor `getRegras()` e `getRegra(codigo)` com a assinatura que uma leitura real teria.

## 3. Mock: Listas

- [x] 3.1 Criar `lib/mock/listas.ts` com os tipos `FtmListStatus`, `FtmObservable`, `FtmListItem`, `FtmListConsumer` e `FtmList`, alinhados a `references/domain/data-model-regra.md` §4 (`ftm_list`, `ftm_list_item`).
- [x] 3.2 Popular o catálogo de observáveis (`OBSERVABLES`) transcrito de `OBS` em `references/design/FtMLista.html`.
- [x] 3.3 Popular as sete listas, seus itens (com vigência temporal) e as regras consumidoras, transcritos de `LISTS`/`ITEMS`/`CONSUMERS` em `references/design/FtMLista.html`, conferindo consistência com `references/domain/seed-regra.md` §7-8.
- [x] 3.4 Expor `getListas()` e `getLista(codigo)` com a assinatura que uma leitura real teria.

## 4. Mock: Alertas

- [x] 4.1 Criar `lib/mock/alertas.ts` com os tipos `AlertLevel`, `AlertChannel`, `AlertTargetKind` e `GeneratedAlert`, transcritos de `TYPES`/`CHANNELS`/`TGT` em `references/design/AlertasGerados.html`.
- [x] 4.2 Popular as oito linhas de alerta transcritas de `ROWS` em `references/design/AlertasGerados.html`, substituindo os códigos de regra `REG-00xx` pelos códigos FtM cadastrados em `lib/mock/regras.ts` (ver design.md - Risks) para que a navegação "Ver regra de origem" resolva de fato.
- [x] 4.3 Expor `getAlertas()` com a assinatura que uma leitura real teria.

## 5. Tela Regras — listagem

- [x] 5.1 Criar `app/app/regras/regras-de-alerta/page.tsx` (Server Component) chamando `getRegras()` e renderizando `PageHead` (breadcrumb "Regras", título, subtítulo) mais a tabela de regras.
- [x] 5.2 Criar `components/regras/RegrasTable.tsx` (Client Component) com busca textual, filtro por schema-alvo, filtro por ação, abas por situação com contagem, seleção em massa e ação em massa (ativar/desativar/arquivar), transcrevendo a listagem de `references/design/FtMRegras.html`.
- [x] 5.3 Linkar cada linha da tabela para `regraDetalhe(codigo)`.

## 6. Tela Regras — detalhe

- [x] 6.1 Criar `app/app/regras/[codigo]/page.tsx` (Server Component) chamando `getRegra(codigo)`, tratando `codigo` inexistente com `notFound()`.
- [x] 6.2 Criar `components/regras/RegraIdentificacao.tsx` para o card de identificação (código, nome, descrição, schema-alvo, prioridade, situação).
- [x] 6.3 Criar `components/regras/ConditionTree.tsx` (Client Component) implementando a árvore de condições AST achatada por profundidade (`walk`/`prune`/`clone`/`flat` do protótipo): adicionar/remover condição, adicionar/remover grupo (`all`/`any`/`not`), seleção de caminho de propriedade restrita ao schema-alvo, seleção de operador restrita ao tipo de dado do caminho, campo de valor constante ou seletor de watchlist ou "sem operando" conforme o operador.
- [x] 6.4 Criar `components/regras/AcoesDisparadas.tsx` (Client Component) para a tabela de ações (tipo, severidade, parâmetros), com adicionar/remover ação.
- [x] 6.5 Criar `components/regras/AstPreview.tsx` derivando o JSON da AST a partir do estado da árvore e das ações (função `toAst` do protótipo), exibido em bloco somente-leitura.
- [x] 6.6 Criar `components/regras/HistoricoVersoes.tsx` para a lista de versões (número, período de vigência, autor, indicação da versão em vigor).
- [x] 6.7 Compor os componentes acima em `app/app/regras/[codigo]/page.tsx`, com backtest e exportação desabilitados (mesmo tratamento de `PageHead.tsx`).

## 7. Tela Listas — listagem

- [x] 7.1 Criar `app/app/alertas/listas/page.tsx` (Server Component) chamando `getListas()` e renderizando `PageHead` (breadcrumb "Listas", título, subtítulo) mais a tabela de listas.
- [x] 7.2 Criar `components/listas/ListasTable.tsx` (Client Component) com busca textual e exibição de situação e contagem de itens ativos/encerrados por lista, transcrevendo a listagem de `references/design/FtMLista.html`.
- [x] 7.3 Linkar cada linha da tabela para `listaDetalhe(codigo)`.

## 8. Tela Listas — detalhe

- [x] 8.1 Criar `app/app/alertas/[codigo]/page.tsx` (Server Component) chamando `getLista(codigo)`, tratando `codigo` inexistente com `notFound()`.
- [x] 8.2 Criar `components/listas/ListaIdentificacao.tsx` para o card de identificação (código, nome, descrição, observável, situação).
- [x] 8.3 Criar `components/listas/ListaItens.tsx` (Client Component) com alternância "mostrar encerrados", inclusão de item (valor, justificativa, data de início) e encerramento de item vigente via modal (`ga-modal`, justificativa e data de término), transcrevendo o editor de itens de `references/design/FtMLista.html`.
- [x] 8.4 Criar `components/listas/ListaConsumidores.tsx` para a lista de regras consumidoras (código, caminho, operador), com estado vazio quando não houver consumidores.
- [x] 8.5 Compor os componentes acima em `app/app/alertas/[codigo]/page.tsx`.

## 9. Tela Alertas

- [x] 9.1 Criar `app/app/regras/alertas-gerados/page.tsx` (Server Component) chamando `getAlertas()` e renderizando `PageHead` (breadcrumb "Regras / Alertas gerados", título, subtítulo).
- [x] 9.2 Criar `components/alertas/AlertasTable.tsx` (Client Component) com busca textual, filtros combináveis (nível, canal, tipo de alvo), abas de contagem por nível e paginação (itens por página, navegação entre páginas), transcrevendo `references/design/AlertasGerados.html`.
- [x] 9.3 Linkar "Ver regra de origem" no menu de contexto de cada linha para `regraDetalhe(rule)`; desabilitar os demais itens do menu sem tela de destino (reenviar pelo canal, abrir histórico do contribuinte, ver detalhe do alerta).

## 10. Verificação

- [x] 10.1 Rodar `npm run lint`.
- [x] 10.2 Rodar `npm run dev` e percorrer manualmente: listagem de Regras (busca, filtros, abas, ação em massa) → detalhe de uma regra (editar árvore de condições, ações, ver AST e versões) → listagem de Listas (busca) → detalhe de uma lista (incluir item, encerrar item, ver consumidores) → tela de Alertas (busca, filtros, abas, paginação, "Ver regra de origem"). Verificado via browser autenticado (banco local disponibilizado pelo usuário, `prisma migrate deploy` + `prisma db seed` executados nesta sessão); todos os fluxos funcionaram no primeiro teste.
- [x] 10.3 Conferir que os subitens "Regras", "Listas", "Alertas" da barra lateral destacam como ativos nas telas correspondentes, inclusive nas rotas de detalhe (`/app/regras/{codigo}`, `/app/alertas/{codigo}`). Encontrado e corrigido: `/app/regras/{codigo}` e `/app/alertas/{codigo}` não compartilham prefixo com `regrasDeAlerta`/`alertasListas`, então o item pai não destacava. Adicionado `matchExtra` a `NavChild` (`components/layout/nav-data.ts`) e `isRegraDetalheRoute`/`isListaDetalheRoute` a `lib/routes.ts`, consumidos por `isRouteActive`/`isChildActive` em `components/layout/Sidebar.tsx`. Confirmado que `alertas-gerados` (irmã de `regras-de-alerta` sob o mesmo prefixo `/app/regras/`) continua destacando só "Alertas".
