## Context

Ver proposal.md - Why. Hoje `components/layout/nav-data.ts` exporta `NAV_ITEMS` (usado só pela Sidebar) e `APP_FEATURES` (usado só pela Topbar, busca de funcionalidade). `lib/routes.ts` só tem rotas para as poucas telas já existentes. Nenhuma tela nova é criada nesta change — os novos itens de menu apontam para rotas que ainda não têm página, seguindo o padrão já existente (`monitoramento`, `ordensDeServico`, `regrasDeAlerta` etc. já são linkados sem página implementada).

Não existe hoje nenhuma fonte de dados de contribuintes no projeto (nem mock, nem schema Prisma). `references/design/Dashboard.html` já tem um mock ilustrativo (`CONTRIBS`, 8 registros com nome, CNPJ, IE, situação, sócio e contador) que serve de referência direta de forma e conteúdo.

## Goals / Non-Goals

**Goals:**
- Sidebar com a árvore de navegação completa pedida (7 grupos, subitens, contagens onde já existiam).
- Busca de funcionalidade migrada para o rodapé da sidebar, dropdown abrindo para cima, oculta quando recolhida.
- Busca de contribuinte na Topbar, com estado vazio (recentes) e estado filtrado, badge de situação.
- Rotas novas cadastradas em `lib/routes.ts` para todo destino de menu que ainda não tem uma.

**Non-Goals:**
- Criar as telas de destino dos novos itens (Listas, Minhas OS, Recolhimentos, Entrega de Declarações, Valores Declarados, Emissão de Documentos, os 4 subitens de Relatórios, os 4 subitens de Operador). Cada uma é conteúdo de uma change futura.
- Buscar contribuintes de uma fonte real (banco, API). O mock cobre a forma da busca; a integração real depende do schema Prisma, ainda inexistente no projeto.
- Persistir "contribuintes recentes" por usuário. A lista de recentes é estática (mock), não histórico real de navegação.

## Decisions

**Reaproveitar `.ga-menu`/`.ga-menu-item` para o dropdown da sidebar, só reposicionado.** O CSS já tem essas classes prontas (usadas hoje na busca da Topbar e no menu do usuário); abrir para cima é só inline style (`bottom` em vez de `top`), sem precisar de classe nova em `gestor-alertas.css`. Alternativa descartada: criar `.ga-menu--up`, desnecessário para uma única instância.

**Um único arquivo `lib/mock/contribuintes.ts` com os contribuintes e a lista de "recentes" como um subconjunto/slice desses mesmos registros.** Evita duas fontes de verdade para os mesmos contribuintes. Segue o padrão de `lib/mock/dashboard.ts` (função `getDashboardData`), aqui como `getContribuintesRecentes()` e `searchContribuintes(query)`.

**Situação cadastral do mock usa os 4 estados do protótipo (`ativo`, `monitorado`, `suspenso`, `baixado`), mapeados para badges já existentes (`ga-badge-success/warning/danger/neutral`).** `references/domain/regras-negocio.md` ainda não enumera os estados possíveis de situação cadastral (a página de Situação Cadastral em si está fora do escopo desta change); os 4 estados do protótipo são um placeholder deliberado, a ser revisto quando a tela de Situação Cadastral for especificada.

**Rótulo "Alertas" (3º subitem de Gestão de Alertas) reaproveita a rota já existente `ROUTES.alertasGerados`.** É a mesma tela que hoje se chama "Alertas gerados" na navegação antiga; só o rótulo do menu muda para acompanhar a nova hierarquia (o grupo já se chama "Gestão de Alertas", então o subitem não precisa repetir "de alertas").

**Rotas novas seguem o padrão `kebab-case` já usado em `lib/routes.ts`, agrupadas por prefixo do grupo pai** (`/app/alertas/listas`, `/app/ordens-de-servico/minhas`, `/app/ordens-de-servico/gestao`, `/app/contribuintes/recolhimentos`, `/app/contribuintes/entrega-declaracoes`, `/app/contribuintes/valores-declarados`, `/app/contribuintes/emissao-documentos`, `/app/relatorios/empresas-abertas`, `/app/relatorios/reativacoes`, `/app/relatorios/acumuladores-credito`, `/app/relatorios/creditos-apuracao`, `/app/operador/ciencia`, `/app/operador/tif`, `/app/operador/auto-embaraco`, `/app/operador/auto-principal`). `ROUTES.ordensDeServico` existente é substituída por `ROUTES.ordensDeServicoGestao`; nada consome a chave antiga fora da Sidebar.

**Ícone do grupo "Operador" usa `lucide-react` `Gavel`**, por proximidade semântica com as ações de fiscalização (auto de embaraço/infração) descritas em `docs/PRD.md`. Os demais ícones de grupo mantêm o mapeamento 1:1 já usado hoje (Painel→LayoutDashboard, Gestão de Alertas→Bell, Ordens de Serviço→ClipboardList, Contribuinte→Users, Relatórios→BarChart3, Configuração→Settings).

**Contagens (`badge`) continuam nos itens de grupo, não nos subitens**, replicando o padrão já existente e o protótipo (`Gestão de Alertas` e `Ordens de Serviço` no `Dashboard.html` trazem `count`). Os demais grupos não têm contagem hoje nem no protótipo.

## Risks / Trade-offs

[Sidebar mais alta com 7 grupos e até 6 subitens each] → o CSS de scroll (`ga-sidebar-nav { overflow: auto }`) já existe; nenhuma mudança de layout necessária, mas vale conferir visualmente que o footer (busca + recolher) não empurra a área de rolagem de um jeito estranho em telas baixas.

[Menu com muitos links para telas inexistentes gera 404 ao clicar] → mesmo comportamento que já existe hoje para Monitoramento/Ordens de Serviço; aceitável para esta change, consistente com o non-goal de não criar as telas.

[Situação cadastral do mock (`ativo/monitorado/suspenso/baixado`) pode não bater com o vocabulário que a tela real de Situação Cadastral vier a adotar] → mock isolado em `lib/mock/contribuintes.ts`, fácil de trocar quando essa tela for especificada; não vaza para outros módulos.
