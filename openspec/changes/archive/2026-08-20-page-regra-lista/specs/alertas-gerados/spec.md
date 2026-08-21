## Purpose

Permite ao auditor fiscal consultar os alertas gerados pelas regras de alerta, filtrando por nível, canal de comunicação e tipo de alvo, para acompanhar a fila de avisos disparados pelo motor de regras.

## ADDED Requirements

### Requirement: Listagem de alertas gerados

A tela Alertas SHALL listar os alertas gerados pelas regras de alerta, exibindo por alerta: data e hora de geração, nível (indicação em tela, alerta, intervenção), regra de origem, canais de comunicação usados, e o alvo (tipo, nome e documento identificador).

#### Scenario: Abertura da listagem

- **WHEN** a pessoa usuária abre a tela Alertas
- **THEN** a lista de alertas gerados é exibida com data/hora, nível, regra de origem, canais e alvo de cada um

#### Scenario: Navegar até a regra de origem

- **WHEN** a pessoa usuária aciona a regra de origem de um alerta
- **THEN** o sistema navega para o detalhe dessa regra

### Requirement: Filtros de alertas gerados

A listagem de alertas SHALL oferecer busca textual (por regra, nome do alvo ou documento) e filtros combináveis por nível, por canal de comunicação e por tipo de alvo (CNPJ, grupo econômico, sócio).

#### Scenario: Buscar por texto

- **WHEN** a pessoa usuária digita um texto no campo de busca
- **THEN** somente os alertas cuja regra, nome do alvo ou documento correspondem ao texto permanecem na listagem

#### Scenario: Filtrar por nível

- **WHEN** a pessoa usuária seleciona um nível no filtro
- **THEN** somente os alertas daquele nível permanecem na listagem

#### Scenario: Filtrar por canal

- **WHEN** a pessoa usuária seleciona um canal no filtro
- **THEN** somente os alertas que usaram esse canal permanecem na listagem

#### Scenario: Filtrar por tipo de alvo

- **WHEN** a pessoa usuária seleciona um tipo de alvo no filtro
- **THEN** somente os alertas cujo alvo é desse tipo permanecem na listagem

### Requirement: Abas de contagem por nível

A listagem de alertas SHALL apresentar abas para filtrar por nível (indicação em tela, alerta, intervenção), incluindo uma aba "Todos", cada uma exibindo a quantidade de alertas naquele nível.

#### Scenario: Selecionar uma aba de nível

- **WHEN** a pessoa usuária seleciona uma aba de nível diferente de "Todos"
- **THEN** somente os alertas daquele nível permanecem na listagem

### Requirement: Paginação da listagem de alertas

A listagem de alertas SHALL ser paginada, permitindo à pessoa usuária escolher a quantidade de itens por página e navegar entre páginas, exibindo a faixa de itens mostrada e o total de itens.

#### Scenario: Navegar para outra página

- **WHEN** a pessoa usuária aciona uma página diferente da atual
- **THEN** a listagem passa a exibir os alertas correspondentes àquela página

#### Scenario: Alterar itens por página

- **WHEN** a pessoa usuária altera a quantidade de itens por página
- **THEN** a listagem é reorganizada de acordo com a nova quantidade, retornando à primeira página
