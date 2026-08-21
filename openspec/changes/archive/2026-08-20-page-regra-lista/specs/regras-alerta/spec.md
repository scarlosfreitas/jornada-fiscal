## Purpose

Permite ao auditor fiscal consultar as regras de alerta cadastradas no motor de regras FollowTheMoney (FtM) e abrir cada regra para inspecionar sua árvore de condições, as ações que ela dispara e seu histórico de versões.

## ADDED Requirements

### Requirement: Listagem de regras de alerta

A tela Regras SHALL listar as regras de alerta cadastradas (`ftm_rule`), exibindo por regra: código, nome, schema-alvo, prioridade, situação, quantidade de condições, ações disparadas e quantidade de alertas gerados. Acionar uma regra SHALL navegar para o detalhe dessa regra.

#### Scenario: Abertura da listagem

- **WHEN** a pessoa usuária abre a tela Regras
- **THEN** a lista de regras cadastradas é exibida com código, nome, schema-alvo, prioridade, situação, condições e ações de cada uma

#### Scenario: Navegar para o detalhe de uma regra

- **WHEN** a pessoa usuária aciona uma regra da listagem
- **THEN** o sistema navega para a tela de detalhe dessa regra

### Requirement: Busca e filtros na listagem de regras

A listagem de regras SHALL oferecer busca textual por código ou nome da regra, filtro por schema-alvo (`FiscalDocument`, `Company`, `TaxDeclaration`, `EconomicEvent`) e filtro por tipo de ação disparada. Os filtros SHALL ser combináveis com a busca textual e entre si.

#### Scenario: Buscar por código ou nome

- **WHEN** a pessoa usuária digita um texto no campo de busca
- **THEN** somente as regras cujo código ou nome correspondem ao texto permanecem na listagem

#### Scenario: Filtrar por schema-alvo

- **WHEN** a pessoa usuária seleciona um schema-alvo no filtro
- **THEN** somente as regras cujo schema-alvo corresponde à seleção permanecem na listagem

#### Scenario: Filtrar por ação disparada

- **WHEN** a pessoa usuária seleciona um tipo de ação no filtro
- **THEN** somente as regras que disparam essa ação permanecem na listagem

### Requirement: Abas por situação da regra

A listagem de regras SHALL apresentar abas para filtrar por situação (`RASCUNHO`, `EM_TESTE`, `ATIVA`, `INATIVA`, `ERRO`, `ARQUIVADA`), incluindo uma aba "Todas". Cada aba SHALL exibir a quantidade de regras naquela situação.

#### Scenario: Selecionar uma aba de situação

- **WHEN** a pessoa usuária seleciona uma aba de situação diferente de "Todas"
- **THEN** somente as regras naquela situação permanecem na listagem

### Requirement: Ações em massa sobre regras selecionadas

A listagem de regras SHALL permitir selecionar uma ou mais regras e aplicar uma ação em massa (ativar, desativar ou arquivar), respeitando as transições de situação previstas para `ftm_rule_status_enum`.

#### Scenario: Selecionar regras e aplicar ação em massa

- **WHEN** a pessoa usuária seleciona uma ou mais regras e aciona uma ação em massa
- **THEN** a situação das regras selecionadas é atualizada de acordo com a ação escolhida

### Requirement: Identificação da regra no detalhe

O detalhe de uma regra SHALL exibir e permitir editar código, nome, descrição, schema-alvo, prioridade e situação da regra (`ftm_rule`).

#### Scenario: Abertura do detalhe de uma regra

- **WHEN** a pessoa usuária abre o detalhe de uma regra
- **THEN** código, nome, descrição, schema-alvo, prioridade e situação dessa regra são exibidos

### Requirement: Árvore de condições da regra

O detalhe de uma regra SHALL exibir e permitir editar a árvore de condições da regra como uma AST recursiva de grupos `all` (E), `any` (OU) e `not` (negação), com condições atômicas compostas por caminho de propriedade em notação de grafo, operador e, conforme o operador, valor constante ou watchlist. As opções de caminho de propriedade oferecidas SHALL corresponder ao schema-alvo da regra, e as opções de operador oferecidas para um caminho SHALL corresponder ao tipo de dado dessa propriedade.

#### Scenario: Adicionar uma condição

- **WHEN** a pessoa usuária adiciona uma condição a um grupo da árvore
- **THEN** uma nova condição aparece nesse grupo, com as opções de caminho restritas ao schema-alvo da regra

#### Scenario: Adicionar um grupo

- **WHEN** a pessoa usuária adiciona um grupo à árvore
- **THEN** um novo grupo `all`/`any`/`not` aparece na posição indicada, podendo conter condições e outros grupos

#### Scenario: Selecionar um caminho de propriedade

- **WHEN** a pessoa usuária seleciona um caminho de propriedade em uma condição
- **THEN** as opções de operador disponíveis para essa condição passam a refletir o tipo de dado do caminho selecionado

#### Scenario: Operador que exige valor constante

- **WHEN** a condição usa um operador que exige valor constante
- **THEN** um campo de valor constante é exibido para preenchimento

#### Scenario: Operador que exige watchlist

- **WHEN** a condição usa um operador que exige watchlist (`IN_LIST`, `NOT_IN_LIST`)
- **THEN** um seletor de watchlist ativa é exibido no lugar do campo de valor constante

#### Scenario: Operador sem operando

- **WHEN** a condição usa um operador que não exige valor nem watchlist (`EXISTS`, `NOT_EXISTS`)
- **THEN** nem campo de valor nem seletor de watchlist são exibidos

#### Scenario: Remover uma condição ou grupo

- **WHEN** a pessoa usuária remove uma condição ou um grupo da árvore
- **THEN** esse nó e, se for um grupo, todos os seus descendentes deixam de aparecer na árvore

### Requirement: Ações disparadas pela regra

O detalhe de uma regra SHALL exibir e permitir editar a lista de ações disparadas quando a regra é satisfeita (`ftm_action`), cada uma com tipo de ação, severidade e parâmetros.

#### Scenario: Adicionar uma ação

- **WHEN** a pessoa usuária adiciona uma ação à regra
- **THEN** uma nova ação aparece na lista, com tipo, severidade e parâmetros editáveis

#### Scenario: Remover uma ação

- **WHEN** a pessoa usuária remove uma ação da regra
- **THEN** essa ação deixa de aparecer na lista de ações disparadas

### Requirement: Representação AST da regra

O detalhe de uma regra SHALL exibir a árvore de condições e as ações disparadas também como um documento JSON equivalente à AST persistida em `ftm_rule_definition.definition`, mantido sincronizado com as edições feitas na árvore e na lista de ações.

#### Scenario: Edição refletida na AST

- **WHEN** a pessoa usuária edita a árvore de condições ou a lista de ações
- **THEN** o documento JSON exibido passa a refletir imediatamente a edição feita

### Requirement: Histórico de versões da regra

O detalhe de uma regra SHALL exibir o histórico de versões da regra (`ftm_rule_definition`), cada uma com número de versão, período de vigência e autor, indicando qual versão está em vigor.

#### Scenario: Exibição do histórico de versões

- **WHEN** a pessoa usuária consulta o histórico de versões de uma regra
- **THEN** cada versão aparece com seu número, período de vigência e autor, e a versão em vigor é identificável
