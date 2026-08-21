## Context

Ver proposal.md - Why.

Estado atual relevante:

- `app/app/layout.tsx` já monta o shell (barra lateral, barra superior, `<main class="ga-content">`, rodapé) uma única vez; toda tela nova só renderiza dentro de `{children}`.
- `lib/routes.ts` já declara `regrasDeAlerta`, `alertasListas`, `alertasGerados` (rotas estáticas, hoje 404) e `regraDetalhe(codigo)` (usada por `components/dashboard/UltimosAlertasTable.tsx` e `components/dashboard/PainelOperacional.tsx`, também 404 hoje). `components/layout/nav-data.ts` já aponta os subitens "Regras", "Listas", "Alertas" para essas rotas.
- Os protótipos-fonte são exports bundlados; `CLAUDE.md` documenta como decodificá-los. Já decodificados nesta etapa de planejamento (script Python: penúltima linha de `<script type="__bundler/template">` é uma string JSON — exceto em `AlertasGerados.html`, cuja string é quebrada em múltiplas linhas via continuação de string JS `\<newline>`, exigindo concatenar as linhas entre a tag e o `</script>` de fechamento antes do `JSON.parse`):
  - `references/design/FtMRegras.html` → tela Regras (listagem + editor de regra com árvore AST, ações e versões).
  - `references/design/FtMLista.html` → tela Listas (listagem + editor de lista com itens SCD2 e consumidores).
  - `references/design/AlertasGerados.html` → tela Alertas (tabela com filtros, abas por nível, paginação). Este protótipo não é do conjunto `FtM*`, mas é a única referência para a tela Alertas e seu nome bate com a rota `ROUTES.alertasGerados` já existente.
- Os três protótipos usam exclusivamente classes `.ga-*` já existentes em `app/gestor-alertas.css` (tabelas, cards, chips, badges, seletores, formulário) mais estilo inline para indentação da árvore de condições — não há classe nova a extrair, ao contrário do que ocorreu em `create-contribuinte`.
- `references/domain/data-model-regra.md` e `references/domain/seed-regra.md` descrevem o mesmo domínio do protótipo (schemas FtM, propriedades, operadores, watchlists, ações, regras) com **os mesmos três exemplos completos** (`NFE_0001`, `CAD_0002`, `DIMP_0003`), incluindo a mesma AST JSONB — os dois arquivos são consistentes entre si e com o protótipo.
- `lib/mock/dashboard.ts` já tem `AlertRow`/`RECENT_ALERTS` com códigos de regra no formato antigo `REG-00xx` (não-FtM), consumidos pelo painel operacional (`components/dashboard/*`) — fora do escopo desta change (ver Risks).

## Goals / Non-Goals

**Goals:**
- Três telas novas (Regras, Listas, Alertas) com endereço próprio, navegáveis a partir dos subitens da barra lateral já existentes.
- Conteúdo e interatividade transcritos fielmente dos protótipos: listagem + busca + filtros + abas para as três telas; editor de árvore de condições AST, editor de ações e histórico de versões no detalhe de regra; editor de itens com vigência temporal e consumidores no detalhe de lista.
- `regraDetalhe(codigo)`, já referenciada pelo painel, passa a resolver para uma página real.

**Non-Goals:**
- Dados reais ou persistência. Tudo vem de mock novo, como as demais telas do produto.
- Corrigir a divergência entre os códigos de regra do painel (`REG-00xx`, em `lib/mock/dashboard.ts`) e os códigos FtM (`NFE_0001` etc.) desta change. Documentado como risco, não como non-goal silencioso.
- Persistir a edição da árvore de condições, das ações ou dos itens de lista entre navegações — o estado de edição é local ao componente, como o protótipo demonstra (ele também não persiste).
- CRUD de watchlists ou regras novas a partir do zero (criar uma regra/lista nova do zero). Os protótipos só demonstram editar uma regra/lista existente a partir da listagem; criar do zero fica para uma change futura caso seja pedido.
- Simulação/backtest funcional (botão "Executar backtest no Lakehouse" do protótipo) e exportação da AST — ambos ficam desabilitados com o mesmo tratamento dado a "Exportar" em `PageHead.tsx`.

## Decisions

**Cada uma das três telas ganha rota própria; o "screen swap" client-side do protótipo (`state.screen: 'list' | 'edit'`) vira navegação de rota.** Os dois protótipos FtM implementam listagem e edição como dois estados de um único componente, sem URL própria para o item aberto. Mas `regraDetalhe(codigo)` já existe e já é linkada de fora (painel), o que só faz sentido como rota navegável — e o mesmo raciocínio já usado em `create-contribuinte` (endereço próprio é compartilhável, recarregável, e o botão voltar funciona de graça) se aplica igualmente ao detalhe de uma lista. Por isso `listaDetalhe(codigo)` é uma rota nova, simétrica a `regraDetalhe`. Alternativa descartada: manter a listagem e o editor na mesma página com estado de UI (`useState`) — replicaria o 404 atual quando algo tentasse linkar direto para uma regra ou lista específica.

**Regras: `/app/regras/regras-de-alerta` (listagem) e `/app/regras/[codigo]` (detalhe).** Segue o padrão de `regraDetalhe`. A listagem é Server Component (dado estático de mock, sem necessidade de estado além de busca/filtro, que fica isolada em um Client Component de tabela — mesmo padrão do painel, onde só quem tem estado é `"use client"`).

**Listas: `/app/alertas/listas` (listagem) e `/app/alertas/[codigo]` (detalhe).** Segue o prefixo de rota já reservado por `ROUTES.alertasListas`. `listaDetalhe(codigo)` é adicionada a `lib/routes.ts` ao lado de `regraDetalhe`.

**Alertas: `/app/regras/alertas-gerados`, tela única (sem detalhe próprio).** O protótipo `AlertasGerados.html` só abre um menu de contexto por linha ("Ver detalhe do alerta", "Ver regra de origem" etc.), sem tela de detalhe de alerta construída — abrir uma tela nova sem protótipo de referência não é o que a instrução pede. "Ver regra de origem" navega para `regraDetalhe(rule)`; os demais itens do menu de contexto (reenviar pelo canal, abrir histórico do contribuinte) ficam desabilitados, mesmo tratamento dado a ações sem tela de destino em `create-contribuinte`.

**Três módulos de mock, um por tela, cada um combinando o dataset do protótipo FtM com o vocabulário de `data-model-regra.md`/`seed-regra.md`:**
- `lib/mock/regras.ts` — tipos `FtmRule`, `FtmConditionNode` (`all`/`any`/`not`/condição atômica), `FtmActionTrigger`, catálogos `RULE_STATUS`, `OPERATORS`, `PATHS_BY_SCHEMA` (caminhos de propriedade por schema-alvo, com tipo de dado), e os oito registros de regra do protótipo (que já incluem os três de `seed-regra.md` com os mesmos códigos e a mesma AST) com suas árvores, ações e versões.
- `lib/mock/listas.ts` — tipos `FtmList`, `FtmListItem`, catálogo `OBSERVABLES` (propriedade que cada lista indexa) e os sete registros de lista do protótipo (que incluem as seis de `seed-regra.md`, mais `LST_IE_BAIXADAS_REATIVACAO` como sétimo exemplo do protótipo), seus itens e as regras consumidoras.
- `lib/mock/alertas.ts` — tipos `AlertLevel`, `AlertChannel`, `AlertTargetKind`, `GeneratedAlert`, e as oito linhas de alerta do protótipo `AlertasGerados.html`, com o código de regra trocado de `REG-00xx` para os códigos FtM cadastrados em `lib/mock/regras.ts` (ver Risks) para que "Ver regra de origem" resolva de fato.
Cada módulo segue o padrão já usado por `lib/mock/dashboard.ts` e `lib/mock/contribuinte-detalhe.ts`: interfaces tipadas, consts estáticas, funções `getX()`/`getX(codigo)` com a assinatura que uma leitura real teria, comentário de cabeçalho registrando o que muda com persistência.

**A árvore de condições é um componente client (`components/regras/ConditionTree.tsx`) que opera sobre uma cópia local da AST em memória, com as mesmas operações do protótipo (`walk`, `prune`, `clone`, achatamento para lista indentada por profundidade).** É árvore recursiva por natureza (grupos contêm grupos), mas o protótipo já resolve a renderização achatando a árvore em uma lista de linhas com profundidade (`flat`/`treeRows`), o que evita recursão de componentes React e mantém a UI simples de reordenar/remover. Reaproveitar esse achatamento em vez de modelar como árvore de componentes aninhados.

**A representação AST em JSON exibida no detalhe da regra é derivada do estado da árvore + ações a cada render (mesma função `toAst` do protótipo), não mantida como estado paralelo.** Evita divergência entre a árvore editável e o JSON exibido.

**Itens de lista com vigência temporal reaproveitam o padrão de "encerrar com justificativa" já usado na ficha do contribuinte (`ga-modal`) para os pop-ups de histórico de campo.** O protótipo `FtMLista.html` já pede exatamente esse padrão (modal de encerramento com data e motivo) e a folha de estilo já o suporta.

## Risks / Trade-offs

[O painel operacional (`lib/mock/dashboard.ts`) referencia alertas com código de regra `REG-00xx`, que não existe no cadastro de regras FtM criado por esta change (`NFE_0001`, `CAD_0002`, ...); `regraDetalhe('REG-0068')` continuaria 404 mesmo depois desta change] → fora do escopo: `dashboard-panel` é uma capability já implementada e trocar seu mock não foi pedido. Registrado aqui para que uma change futura de unificação do painel com o motor de regras FtM saiba a origem da divergência. A tela Alertas desta change usa os códigos FtM corretos, então "Ver regra de origem" funciona a partir dela.

[Os protótipos não têm tela de detalhe de alerta nem ação funcional de "reenviar pelo canal" — a instrução do usuário citou só Regras/Listas/Alertas] → itens de menu sem tela de destino ficam desabilitados com indicação visual, como já ocorre em `PageHead.tsx` para "Exportar"; não é regressão, é o estado que os protótipos já demonstram.

[A árvore de condições permite estruturas arbitrariamente aninhadas (`all`/`any`/`not` dentro de `all`/`any`/`not`), o que pode gerar UI muito larga em regras complexas] → o protótipo já resolve isso com indentação progressiva por profundidade (`margin-left` calculado) e não impõe limite de profundidade; nenhum dos oito exemplos de regra do protótipo passa de dois níveis, então a UI não precisa de tratamento especial para profundidade alta nesta change.

[`ftm_list.property_id` aponta para uma propriedade específica (ex.: `taxNumber`), mas o protótipo de Listas usa um catálogo simplificado `OBS` com apenas 11 propriedades observáveis, não as ~65 de `seed-regra.md`] → mantém-se o catálogo `OBS` do protótipo, que já cobre as sete listas de exemplo; ampliá-lo para todas as propriedades observáveis do domínio não é necessário para esta change e pode ser feito quando uma tela de propriedades (`FtMPropriedade.html`, fora do pedido do usuário) entrar em escopo.
