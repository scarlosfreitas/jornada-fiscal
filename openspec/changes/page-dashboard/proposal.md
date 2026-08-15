## Why

A change `dashboard-shell` monta a moldura da aplicação e deixa `/dashboard` com um conteúdo placeholder deliberadamente vazio. O Painel operacional é a primeira tela real do produto e a porta de entrada da jornada do auditor: é onde alertas, monitoramentos e ordens de serviço aparecem consolidados. Sem ele, o shell existe sem nada para enquadrar e não há como validar visualmente o design system contra o protótipo.

## What Changes

- `app/(dashboard)/dashboard/page.tsx` deixa de ser placeholder e passa a renderizar o Painel operacional completo, reproduzindo `references/design/Dashboard.html`. A URL continua sendo `/dashboard`.
- A página consome o shell já montado por `dashboard-shell` — sidebar, topbar e rodapé vêm de `components/layout/` e **não** são redeclarados aqui. A página entrega somente o conteúdo interno de `<main class="ga-content">`.
- Novo conteúdo, na ordem do protótipo:
  - cabeçalho de página (`.ga-page-head`) com breadcrumb "Operações / Painel", título, subtítulo, seletor de período (7/30/90 dias) e os botões "Exportar" e "Atualizar";
  - faixa de 4 KPIs (`.ga-kpi-grid`), com valores e comparativos que mudam conforme o período;
  - gráfico de linha "Alertas gerados por dia" por nível de monitoramento, com legenda;
  - gráfico de rosca "OS de intervenção" por situação;
  - gráfico de barras "Regras que mais disparam";
  - lista "Canais de comunicação" com barra de proporção por canal;
  - tabela "Últimos alertas gerados";
  - tabela "Monitoramentos ativos".
- Novas dependências: `chart.js` e `react-chartjs-2`, para os três gráficos.
- Os dados são mocks tipados extraídos do protótipo, isolados em um módulo próprio, com contrato pensado para ser trocado por dados reais sem mexer nos componentes de apresentação.

## Capabilities

### New Capabilities
- `dashboard-panel`: o Painel operacional — a visão consolidada de alertas, monitoramentos, ordens de serviço e canais de comunicação exibida em `/dashboard`, incluindo a filtragem por período e as listas de acompanhamento.

### Modified Capabilities
Nenhuma. `dashboard-shell` continua valendo sem alteração: esta change é consumidora do shell, não o modifica. Enquanto `dashboard-shell` não estiver arquivada, seu requisito de conteúdo placeholder em `/dashboard` permanece como delta pendente — esta change o substitui na prática e nenhuma das duas specs entra em conflito depois de arquivadas, porque o placeholder não é um requisito da spec de shell.

## Impact

- **Depende de**: `dashboard-shell` implementada (grupos 3 a 6 das suas tarefas). Sem `components/layout/` e sem `app/(dashboard)/layout.tsx`, esta change não tem onde encaixar.
- **Código**: `app/(dashboard)/dashboard/page.tsx` (substituído), `components/dashboard/*` (novo), `lib/mock/dashboard.ts` (novo), `components/icons/` (novos ícones de KPI e das ações da página).
- **Dependências**: `+chart.js`, `+react-chartjs-2`. Nenhuma outra.
- **Estilos**: nenhum. Todas as classes usadas (`.ga-page-head`, `.ga-kpi`, `.ga-card`, `.ga-chip`, `.ga-level`, `.ga-table`, `.ga-table-wrap`, `.ga-btn`, `.ga-select`) já existem em `app/gestor-alertas.css`.
- **Fora do escopo**: dados reais (não há `prisma/schema.prisma` nem API); ação do botão "Exportar", que fica visível e desabilitado; navegação dos links "Ver todos" / "Ver regras" / "Ver monitoramentos" para telas que ainda não existem; atualização em tempo real da fila de alertas.
