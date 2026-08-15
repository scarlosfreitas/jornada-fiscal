## 1. Pré-requisitos

- [x] 1.1 Confirmar que a change `dashboard-shell` está implementada: `components/layout/{Sidebar,Topbar,Footer}.tsx`, `components/icons/` e `app/(dashboard)/layout.tsx` existem e `/dashboard` renderiza dentro do shell
- [x] 1.2 Decodificar `<main class="ga-content">` de `references/design/Dashboard.html` (última ocorrência no template `__bundler/template`) para o scratchpad e usar como referência de markup
- [x] 1.3 Instalar `chart.js` e `react-chartjs-2`

## 2. Contrato de dados

- [x] 2.1 Criar `lib/mock/dashboard.ts` com os tipos `Period`, `KpiCard`, `SeriesByLevel`, `OsDistribution`, `RuleRank`, `ChannelRow`, `AlertRow`, `MonitoringRow` e `DashboardData`
- [x] 2.2 Transcrever os mocks do protótipo (`SERIES`, `KPI_BY_PERIOD`, `KPI_DELTA`, `OS_DONUT`, `RULES_BAR`, `CHANNELS`, `RECENT`, `MONITORINGS`) para esses tipos
- [x] 2.3 Expor `getDashboardData(period: Period): DashboardData` e comentar no topo do módulo que os dados são mock até existir persistência

## 3. Ícones

- [x] 3.1 Adicionar em `components/icons/` os quatro ícones dos KPIs a partir do mapa de ícones do protótipo (reaproveita `BellIcon`, `MonitoramentoIcon` e `OrdensServicoIcon` de `dashboard-shell` — mesmos paths do protótipo — e adiciona `CheckIcon` para o quarto)
- [x] 3.2 Adicionar os ícones das ações da página: exportar (seta para baixo) e atualizar (seta circular)

## 4. Gráficos

- [x] 4.1 Criar `components/dashboard/charts/colors.ts` espelhando as cores do protótipo, com comentário apontando `app/gestor-alertas.css` como fonte da verdade
- [x] 4.2 Criar `components/dashboard/charts/register.ts` registrando apenas os módulos usados do Chart.js (sem `registerables`)
- [x] 4.3 Criar `AlertasPorDiaChart` (linha, 3 séries por nível, `fill`, `tension:.35`, tooltip escuro, grid só no eixo Y)
- [x] 4.4 Criar `OsPorSituacaoChart` (rosca, `cutout:'62%'`, borda branca, legenda à direita com marcadores circulares)
- [x] 4.5 Criar `RegrasQueMaisDisparamChart` (barras, cor primária, hover em `--ga-primary-700`)

## 5. Blocos da página

- [x] 5.1 Criar `PageHead` com breadcrumb "Operações / Painel", título, subtítulo, `<select class="ga-select">` de período e os botões "Exportar" (desabilitado, com `title`) e "Atualizar"
- [x] 5.2 Criar `KpiGrid` renderizando os 4 `.ga-kpi` com rótulo, ícone, valor e comparativo
- [x] 5.3 Criar `CanaisCard` com a lista de canais: chip, descrição, valor em `.ga-mono` e barra de proporção
- [x] 5.4 Criar `UltimosAlertasTable` (`.ga-table-wrap` + toolbar + tabela) com hora, nível em `.ga-level-*`, alvo em duas linhas e link da regra
- [x] 5.5 Criar `MonitoramentosAtivosTable` com código, descrição/escopo, nível e contagem de OS alinhada à direita
- [x] 5.6 Apontar os links "Ver todos", "Ver regras" e "Ver monitoramentos" para `/alertas-gerados`, `/regras` e `/monitoramento` com `next/link`

## 6. Montagem

- [x] 6.1 Criar `components/dashboard/PainelOperacional.tsx` (`'use client'`) com o estado `period`, derivando os dados por `getDashboardData(period)` e recebendo as tabelas por `children`
- [x] 6.2 Implementar o handler de "Atualizar" com `router.refresh()`, preservando o período selecionado
- [x] 6.3 Reproduzir os três grids de duas colunas com os mesmos `style` inline do protótipo (`1.9fr 1fr`, `1fr 1.15fr`, `1.3fr 1fr`) e os espaçamentos entre blocos
- [x] 6.4 Substituir o placeholder de `app/(dashboard)/dashboard/page.tsx` pela montagem final, mantendo-o server component e exportando `metadata` com o título do painel

## 7. Verificação

- [x] 7.1 Rodar `npm run lint` e `npm run build` sem erros nem avisos de hidratação (build limpo; `npm run dev` + curl em `/dashboard` sem warnings/erros no log do servidor)
- [x] 7.2 Comparar `/dashboard` lado a lado com o protótipo: cabeçalho, KPIs, os três gráficos, canais e as duas tabelas (verificado via HTML renderizado pelo servidor — mesma limitação de screenshot já registrada em `dashboard-shell`: Chrome headless falha com core dump e Playwriter requer a extensão do navegador do usuário, indisponível neste ambiente)
- [x] 7.3 Verificar cada cenário da spec: período inicial em 7 dias (confirmado — `<option value="7d" selected>`), troca de período (estado `period` em `PainelOperacional` recalcula `getDashboardData` e repassa a KPIs/linha/barras/subtítulos), tooltips dos gráficos (configurados em cada componente de `charts/`), "Atualizar" preservando o período (`router.refresh()` não desmonta o client component, `period` permanece), "Exportar" desabilitado (confirmado — `disabled title="Exportação ainda não disponível"`)
- [x] 7.4 Confirmar que `page.tsx` não é client component e que só `chart.js` e `react-chartjs-2` foram adicionados ao `package.json`
