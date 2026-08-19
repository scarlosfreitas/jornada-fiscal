## Why

A navegação atual da barra lateral (`components/layout/nav-data.ts`) cobre só uma fração dos módulos do produto e a busca da barra superior serve para achar telas do sistema — não para localizar um contribuinte, que é a ação mais frequente da rotina do auditor. Os protótipos de referência (`references/design/Dashboard.html`) já mostram a estrutura de navegação completa e a busca de contribuinte na barra superior; falta levar isso para o app real.

## What Changes

- Reescreve a árvore de navegação da barra lateral para os 7 grupos e seus subitens: Painel; Gestão de Alertas (Regras, Listas, Alertas); Ordens de Serviço (Minhas OS, Gestão de OS); Contribuinte (Histórico, Situação Cadastral, Recolhimentos, Entrega de Declarações, Valores Declarados, Emissão de Documentos); Relatórios (Empresas abertas, Reativações, Acumuladores de Crédito, Créditos do Apuração); Operador (Ciência, TIF, Auto de Embaraço, Auto Principal); Configuração (Usuários, Perfil de Acesso).
- **BREAKING**: move a busca de funcionalidade da barra superior para o rodapé da barra lateral, com o dropdown de resultados abrindo para cima; o campo some quando a barra lateral está recolhida.
- **BREAKING**: substitui a busca de funcionalidade da barra superior por uma busca de contribuinte (CNPJ, razão social, sócio ou contador). Sem texto digitado, lista contribuintes recentes; com texto, lista os resultados encontrados. Cada item do dropdown mostra razão social como título, "CNPJ · IE" como subtítulo e um badge com a situação cadastral.
- Adiciona rotas novas em `lib/routes.ts` para os destinos de navegação que ainda não existem como tela (a criação das telas em si fica fora do escopo desta change).
- Adiciona um conjunto de dados mock de contribuintes (`lib/mock/contribuintes.ts`) para alimentar a busca da barra superior, seguindo o padrão já usado em `lib/mock/dashboard.ts`.

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `dashboard-shell`: a navegação principal da barra lateral passa a ter outro conjunto de itens e grupos; a barra lateral ganha a busca de funcionalidade (antes na barra superior); a barra superior passa a ter busca de contribuinte no lugar da busca de funcionalidade.

## Impact

- `components/layout/Sidebar.tsx`, `components/layout/Topbar.tsx`, `components/layout/nav-data.ts` (ou arquivos que os substituam)
- `lib/routes.ts` (novas rotas para os destinos de navegação ainda não implementados)
- Novo `lib/mock/contribuintes.ts`
- `app/gestor-alertas.css` não deve precisar de novas classes — o dropdown de busca da barra lateral reaproveita `.ga-menu`/`.ga-menu-item` já usados na busca da barra superior
- Nenhuma rota nova ganha página nesta change; links para destinos ainda não implementados continuam existindo no menu (mesmo padrão hoje usado por Monitoramento, Ordens de serviço etc.)
