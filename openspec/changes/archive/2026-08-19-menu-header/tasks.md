## 1. Rotas

- [x] 1.1 Em `lib/routes.ts`, adicionar as rotas novas descritas em design.md (grupo Alertas: `listas`; grupo Ordens de Serviço: `ordensDeServicoMinhas`, `ordensDeServicoGestao` substituindo `ordensDeServico`; grupo Contribuinte: `contribuinteRecolhimentos`, `contribuinteEntregaDeclaracoes`, `contribuinteValoresDeclarados`, `contribuinteEmissaoDocumentos`; grupo Relatórios: `relatoriosEmpresasAbertas`, `relatoriosReativacoes`, `relatoriosAcumuladoresCredito`, `relatoriosCreditosApuracao`; grupo Operador: `operadorCiencia`, `operadorTif`, `operadorAutoEmbaraco`, `operadorAutoPrincipal`; adicionar rota do contribuinte individual, ex. `contribuinte(id)`, para os itens da busca de contribuinte navegarem a algum destino)
- [x] 1.2 Atualizar qualquer uso existente de `ROUTES.ordensDeServico` para a nova chave

## 2. Dados mock de contribuintes

- [x] 2.1 Criar `lib/mock/contribuintes.ts` com a lista de contribuintes (nome, CNPJ, IE, situação cadastral, sócio, contador), mapeamento de situação → rótulo/classe de badge, `getContribuintesRecentes()` e `searchContribuintes(query)` (filtra por CNPJ, razão social, sócio ou contador)

## 3. Navegação da barra lateral

- [x] 3.1 Reescrever `NAV_ITEMS` em `components/layout/nav-data.ts` com os 7 grupos e subitens definidos na spec (`dashboard-shell`), com ícones e contagens conforme design.md
- [x] 3.2 Em `components/layout/Sidebar.tsx`, adicionar o campo "Busca funcionalidade" no rodapé (acima de "Recolher menu"), reaproveitando `APP_FEATURES` e a lógica de filtro hoje na Topbar
- [x] 3.3 Abrir o dropdown de resultados da busca de funcionalidade para cima (`bottom` em vez de `top`, reaproveitando `.ga-menu`/`.ga-menu-item`)
- [x] 3.4 Ocultar o campo de busca de funcionalidade quando `collapsed === true`
- [x] 3.5 Implementar fechar com `Esc` e ao clicar fora, e estado "nenhuma funcionalidade encontrada"

## 4. Busca de contribuinte na barra superior

- [x] 4.1 Em `components/layout/Topbar.tsx`, remover a busca de funcionalidade e adicionar o campo de busca de contribuinte com placeholder "Buscar contribuinte — ex. CNPJ, razão social, sócio, contador"
- [x] 4.2 Ao focar sem texto digitado, mostrar `getContribuintesRecentes()` no dropdown; ao digitar, mostrar `searchContribuintes(query)`
- [x] 4.3 Cada item do dropdown mostra razão social como título, "CNPJ · IE" como subtítulo e badge de situação cadastral
- [x] 4.4 Selecionar um item navega para a rota do contribuinte e fecha o dropdown; implementar fechar com `Esc` e ao clicar fora, e estado "nenhum contribuinte encontrado"

## 5. Verificação

- [x] 5.1 `npm run lint`
- [x] 5.2 Rodar `npm run dev` e conferir visualmente: navegação completa da sidebar (grupos/subitens/contagens/destaque do item ativo), recolher/expandir a sidebar (busca de funcionalidade some/aparece), dropdown da busca de funcionalidade abrindo para cima, busca de contribuinte na topbar com estado vazio (recentes) e com texto digitado (filtrado e "nenhum encontrado")
