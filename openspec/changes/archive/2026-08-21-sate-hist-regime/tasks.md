## 1. Acesso à view `analytics.sate_hist_regime`

- [x] 1.1 Criar `lib/sate-hist-regime.ts` como módulo `server-only`, espelhando a forma de `lib/sate-instituicao.ts` (import de `Prisma` e `prisma`, SQL parametrizado via `Prisma.sql`).
- [x] 1.2 Mover para esse módulo os tipos `HistoricoColuna`, `HistoricoRegistro` e `HistoricoCadastral`, hoje em `lib/mock/contribuinte-detalhe.ts`, acrescentando o campo `cad_municipio_uf` a `HistoricoRegistro`.
- [x] 1.3 Definir nesse módulo a lista de colunas da tabela, com Município (`cad_municipio_uf`, comparável, não fixa) acrescentada após Natureza jurídica; Data início continua `fixed: true` e as duas datas continuam `compare: false`.
- [x] 1.4 Implementar `getHistoricoRegime(idContribuinte: string): Promise<HistoricoRegistro[]>` — `BigInt()` do `id` dentro de `try/catch` devolvendo `[]` para `id` não numérico; `SELECT` com `to_char(cad_hist_ini::timestamp, 'DD/MM/YYYY HH24:MI:SS')`, o mesmo para `cad_hist_fim`, `concat_ws('-', cad_municipio, cad_uf) AS cad_municipio_uf`, os quatro atributos textuais restantes, `WHERE cad_id = ${idBigInt}` e `ORDER BY cad_hist_ini`.
- [x] 1.5 Tratar relação inexistente: `catch` reconhecendo `PrismaClientKnownRequestError` código `P2010` com `meta.code === "42P01"` → log no servidor e retorno `[]`; qualquer outro erro é relançado.

## 2. Aba Histórico ligada à fonte real

- [x] 2.1 Alterar `app/app/contribuintes/[id]/historico/page.tsx` para chamar `getHistoricoRegime(id)` e montar `{ colunas, registros }` a partir do novo módulo, no lugar de `getHistoricoCadastral`.
- [x] 2.2 Ajustar `components/contribuinte/HistoricoCadastralTab.tsx` para importar os tipos de `@/lib/sate-hist-regime`; a lógica de dedução, seleção de colunas e destaque permanece inalterada.
- [x] 2.3 Fazer a aba exibir a mensagem de histórico indisponível quando `registros` vier vazio (contribuinte sem registro ou view ausente), distinta da mensagem já existente para "nenhuma alteração nas colunas selecionadas".
- [x] 2.4 Remover de `lib/mock/contribuinte-detalhe.ts` `getHistoricoCadastral`, `HISTORICO_COLUNAS`, `HISTORICO_REGISTROS` e os tipos migrados, preservando o restante do módulo e a entrada `historico-cadastral` de `lerFonteOu` se ela for usada por outra tela.
- [x] 2.5 Abrir `/app/contribuintes/<id>/historico` para um `cad_id` real e conferir: ordem cronológica crescente, datas em `DD/MM/YYYY HH:MM:SS`, coluna Município no formato `MACAPA-AP`, destaque dos valores alterados e a contagem "N de M registros com alteração". (Verificado em navegador real via CDP contra `cad_id=1050658`, 607 registros. Achado e corrigido um bug real nesse processo: `ORDER BY cad_hist_ini` sem qualificação se ligava ao *alias* de saída — a string já formatada `DD/MM/YYYY` — em vez da coluna de origem `YYYY-MM-DD`, ordenando por dia-do-mês em vez de cronologicamente. Corrigido qualificando a referência como `analytics.sate_hist_regime.cad_hist_ini`; ver comentário no SQL.)

## 3. Subitens do Contribuinte inertes fora da ficha

- [x] 3.1 Tornar `href` opcional em `NavChild` (`components/layout/nav-data.ts`) e remover o `href` do item pai `contrib` e dos sete subitens do grupo, que passam a ser resolvidos dinamicamente.
- [x] 3.2 Remover de `lib/routes.ts` as sete constantes `ROUTES.contribuinte*`, agora sem uso — `contribuinteTab(id, tab)` é a única forma de endereçar uma aba.
- [x] 3.3 Remover de `APP_FEATURES` as sete entradas do módulo `contribuinte`, que apontavam para as rotas sem `[id]`.
- [x] 3.4 Em `components/layout/Sidebar.tsx`, ajustar `getNavItems` para preencher os `href` dos subitens do grupo `contrib` com `contribuinteTab(id, tab)` quando houver `id` na rota, e deixá-los sem `href` quando não houver.
- [x] 3.5 Renderizar subitem sem `href` como elemento inerte (não `<Link>`), com `aria-disabled="true"` e distinção visual de indisponível, usando as classes `ga-*` existentes.
- [x] 3.6 Verificar que `isChildActive` e `findActiveParentKey` lidam com `href` ausente sem quebrar o destaque do item ativo dos demais grupos.

## 4. Item "Contribuinte" abre a busca da barra superior

- [x] 4.1 Criar `components/layout/ShellSearchProvider.tsx` (`"use client"`) com contexto expondo o gatilho de abertura da busca de contribuinte e o registro do manipulador pela `Topbar`.
- [x] 4.2 Envolver `Sidebar` e `Topbar` com o provider em `app/app/layout.tsx`, mantendo o layout como componente de servidor.
- [x] 4.3 Em `components/layout/Topbar.tsx`, registrar no contexto um manipulador que faz `setSearchOpen(true)` e foca `searchInputRef`, sem alterar o comportamento já existente de foco no campo.
- [x] 4.4 Em `components/layout/Sidebar.tsx`, fazer o `onClick` do item pai `contrib` acionar a busca quando não houver `id` na rota, e manter `toggleGroup` quando houver.
- [x] 4.5 Conferir no navegador: fora de uma ficha, acionar "Contribuinte" abre o dropdown da barra superior com "Contribuintes recentes" e o campo focado; dentro de uma ficha, o mesmo acionamento apenas expande/recolhe os subitens. (Verificado em navegador real via CDP: em `/app`, o clique abre o dropdown com "Contribuintes recentes" e foca o campo; em `/app/contribuintes/1050658/linha-do-tempo`, o mesmo clique apenas recolhe/expande os subitens, sem abrir a busca. Testado também o caso do bug original — `/app/contribuintes/historico/linha-do-tempo` — onde "historico" tenta ser lido como id: o clique abre a busca, não expõe subitens.)

## 5. Fechamento

- [x] 5.1 Rodar `npm run lint` e `npm run build` sem erro. (build limpo; os dois erros de `npm run lint` — `Topbar.tsx` linha do `useEffect` de busca e `sate-instituicao.ts` — já existiam em `main` antes desta change, confirmado via `git stash`.)
- [x] 5.2 Percorrer as sete abas da ficha a partir da barra lateral com um contribuinte aberto e confirmar que cada subitem leva à sua aba, e não à linha do tempo. (Verificado em navegador real via CDP: hrefs dos sete subitens corretos com o id; clique em "Histórico" navega para `/historico`, clique em "Situação Cadastral" navega para `/situacao-cadastral` — não para linha do tempo.)
- [x] 5.3 Confirmar que nenhum endereço `/app/contribuintes/<nome-de-aba>` é alcançável pela barra lateral ou pela busca de funcionalidade. (Confirmado: nenhum item da sidebar ou da busca de funcionalidade aponta para essas rotas — as sete entradas foram removidas de `APP_FEATURES`, e os subitens do grupo Contribuinte só têm `href` quando há um `id` real na rota. A rota em si continua existindo via Next.js — `/app/contribuintes/historico` ainda resolve porque `[id]` casa com qualquer segmento — mas isso é preexistente e fora do escopo definido no proposal/design: o pedido era eliminar o link quebrado no produto, não a rota dinâmica em si.)
