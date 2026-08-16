## Context

Ver `proposal.md` — Why. Restrições e material de partida:

- O shell (`app/(dashboard)/layout.tsx`, `components/layout/{Sidebar,Topbar,Footer}.tsx`) vem da change `dashboard-shell`. Esta página entra como `children` desse layout e não conhece nada da moldura.
- Todas as classes necessárias já existem em `app/gestor-alertas.css`: `.ga-page-head`, `.ga-page-actions`, `.ga-breadcrumb`, `.ga-kpi-grid`/`.ga-kpi`, `.ga-card`/`.ga-card-head`/`.ga-card-body`, `.ga-chip`, `.ga-level` + `.ga-level-{red,yellow,gray}`, `.ga-table-wrap`/`.ga-table-toolbar`/`.ga-table`, `.ga-btn-{primary,secondary}`, `.ga-select`. Nenhum CSS novo.
- Markup de referência: `references/design/Dashboard.html`, `<main class="ga-content">` do template `__bundler/template`. A estrutura é: cabeçalho de página → grid de 4 KPIs → grid `1.9fr 1fr` (linha | rosca) → grid `1fr 1.15fr` (barras | canais) → grid `1.3fr 1fr` (tabela de alertas | tabela de monitoramentos). Os grids são `style` inline no próprio protótipo, não classes — reproduzir como estão.
- Mocks do protótipo (script `text/x-dc`): `SERIES` (3 séries × 3 períodos), `KPI_BY_PERIOD` + `KPI_DELTA`, `OS_DONUT` (6 situações), `RULES_BAR` (6 regras), `CHANNELS` (5 canais), `RECENT` (6 alertas), `MONITORINGS` (5 monitoramentos).
- Os gráficos no protótipo são Chart.js sobre `<canvas>`, com opções detalhadas (tooltip escuro, grid só no eixo Y, fontes IBM Plex, `cutout:'62%'` na rosca, legenda à direita).
- Não existe `prisma/schema.prisma` nem API: não há de onde buscar dados reais nesta change.

## Goals / Non-Goals

**Goals:**

- Paridade visual com o protótipo, usando exclusivamente as classes `ga-*` existentes.
- Isolar os dados atrás de um contrato tipado, para que a troca de mock por dado real não toque nos componentes de apresentação.
- Manter o máximo possível de árvore como server component; estado só onde o filtro de período exige.

**Non-Goals:**

- Buscar dados reais, definir schema Prisma ou criar rotas de API.
- Implementar as telas de destino dos links ("Ver todos", "Ver regras", "Ver monitoramentos").
- Exportação de dados.
- Atualização automática/streaming da fila de alertas.

## Decisions

### 1. `page.tsx` server, uma ilha client para o período

`app/(dashboard)/dashboard/page.tsx` continua server component (exporta `metadata`) e renderiza `components/dashboard/PainelOperacional.tsx` (`'use client'`), que é dono do estado `period`.

Só três blocos dependem do período: os KPIs, o gráfico de linha e o de barras — mais os subtítulos que exibem o rótulo do período. As duas tabelas (alertas recentes e monitoramentos ativos) não dependem. Elas são renderizadas no server e passadas para a ilha client como `children` (slot), evitando arrastar as listas inteiras para o bundle do cliente.

*Alternativa considerada*: marcar a página inteira como `'use client'`. Rejeitada — joga todas as tabelas e mocks para o cliente sem necessidade. *Alternativa considerada*: período na URL (`?periodo=30d`) com server component relendo `searchParams`. Rejeitada nesta change — dá navegação de volta e link compartilhável, mas custa um round-trip por troca de filtro sobre dados que hoje são constantes locais; vale reconsiderar quando os dados forem reais.

### 2. Gráficos com `chart.js` + `react-chartjs-2`

Decisão confirmada com o usuário. Registrar apenas os controllers e elementos usados (`LineElement`, `PointElement`, `BarElement`, `ArcElement`, `CategoryScale`, `LinearScale`, `Filler`, `Tooltip`, `Legend`) em vez de `Chart.register(...registerables)`, para não arrastar o pacote inteiro. As opções (`gridOpts`, tooltip escuro, `cutout:'62%'`, legenda à direita da rosca) são transcritas do protótipo.

Cada gráfico é um client component próprio em `components/dashboard/charts/`, recebendo dados já formatados por props — assim a configuração do Chart.js não vaza para o componente de página.

*Alternativa considerada*: SVG à mão. Rejeitada pelo usuário — tooltip, escalas e legenda dos três gráficos seriam código nosso.

### 3. Cores dos gráficos em um módulo único

Chart.js precisa de cores concretas; não aceita `var(--ga-*)`. As cores ficam em `components/dashboard/charts/colors.ts`, espelhando os tokens do CSS (mesmo mapa `C` do protótipo: `#2A45D4`, `#C2321F`, `#E8A317`, `#8A91A3`, …), com comentário apontando `app/gestor-alertas.css` como fonte da verdade.

*Alternativa considerada*: ler os tokens em runtime com `getComputedStyle(document.documentElement)`. Rejeitada — exige efeito no cliente antes de montar o gráfico, complica SSR e não paga o preço para um punhado de cores que não mudam (não há tema escuro).

### 4. Dados atrás de um contrato tipado

`lib/mock/dashboard.ts` exporta os tipos (`Period`, `KpiCard`, `AlertRow`, `MonitoringRow`, `ChannelRow`, `SeriesByLevel`, `DashboardData`) e uma função `getDashboardData(period: Period): DashboardData`. Os componentes consomem só o tipo.

Quando houver banco, a função vira `async` e passa a consultar — a assinatura já é a de uma leitura por período, e os componentes de apresentação não mudam. O caminho `lib/mock/` deixa explícito, para quem ler depois, que aquilo não é dado real.

### 5. "Atualizar" e "Exportar"

"Atualizar" chama `router.refresh()` e reinicializa o carimbo "atualizado há N min" da tabela de alertas, preservando o período selecionado. Com mocks o efeito visível é o carimbo — o que é honesto e vira recarga real sem mudar o handler quando os dados vierem do server.

"Exportar" fica `disabled` com `title` explicando que a exportação ainda não está disponível. Um botão que não faz nada e não se anuncia como indisponível é pior do que um botão desabilitado.

### 6. Links de navegação apontam para as rotas planejadas

"Ver todos" → `/alertas-gerados`, "Ver regras" → `/regras`, "Ver monitoramentos" → `/monitoramento`, códigos de regra → `/regras/<codigo>`. Usam `next/link` e mantêm o alinhamento com o `path` de `APP_FEATURES` definido em `dashboard-shell`. Levam a 404 até as telas existirem — preferível a `href="#"`, que teria de ser caçado depois.

### 7. Conversões do protótipo

`sc-raw-table`/`thead`/`tbody`/`tr`/`th`/`td` → elementos HTML normais; `sc-raw-select` → `<select className="ga-select">` controlado; `sc-for` → `.map()`; `sc-camel-on-*` → handlers React; `sc-camel-view-box` → `viewBox`. Os ícones novos (KPIs, "Exportar", "Atualizar") entram em `components/icons/`, seguindo o padrão criado em `dashboard-shell`.

## Risks / Trade-offs

- **Peso do bundle**: Chart.js é a maior dependência do projeto até aqui → registro seletivo dos módulos e gráficos isolados em componentes client próprios, para que o resto da página não os carregue.
- **Hidratação do `<canvas>`**: `react-chartjs-2` renderiza o canvas no server e monta o gráfico no cliente → se aparecer mismatch de hidratação, envolver os gráficos com `next/dynamic(..., { ssr: false })` e um esqueleto da altura do card (280px / 260px), evitando salto de layout.
- **Mocks confundidos com dados reais**: os números são plausíveis e podem ser lidos como produção → todos concentrados sob `lib/mock/`, com comentário no topo do módulo.
- **Links para telas inexistentes**: 404 até as páginas serem criadas → aceito conscientemente (decisão 6); as rotas estão registradas em `APP_FEATURES`.
- **Grids em `style` inline**: os três grids de duas colunas não têm classe própria na folha → reproduzidos inline como no protótipo. Se mais telas repetirem esses arranjos, o certo é promovê-los a classes em `gestor-alertas.css`, não criar outra folha.

## Migration Plan

Não se aplica — não há dados nem usuários. A página substitui o placeholder criado por `dashboard-shell`; reverter é restaurar aquele arquivo.

## Open Questions

- O carimbo "atualizado há 4 min" da tabela de alertas é estático no protótipo. Fica estático nesta change; quando os dados forem reais, vira tempo relativo ao `fetchedAt` — não altera specs nem tarefas.
