## Purpose

Permite ao auditor fiscal consultar as watchlists de observáveis usadas pelas regras de alerta, e gerenciar a inclusão e o encerramento de vigência de itens em cada lista, com histórico completo.

## ADDED Requirements

### Requirement: Listagem de listas de observáveis

A tela Listas SHALL listar as watchlists cadastradas (`ftm_list`), exibindo por lista: código, nome, propriedade/observável armazenado, situação, quantidade de itens ativos, quantidade de itens encerrados e quantidade de regras que a consomem. Acionar uma lista SHALL navegar para o detalhe dessa lista.

#### Scenario: Abertura da listagem

- **WHEN** a pessoa usuária abre a tela Listas
- **THEN** a lista de watchlists cadastradas é exibida com código, nome, observável, situação e contagem de itens de cada uma

#### Scenario: Navegar para o detalhe de uma lista

- **WHEN** a pessoa usuária aciona uma lista da listagem
- **THEN** o sistema navega para a tela de detalhe dessa lista

### Requirement: Busca na listagem de listas

A listagem de listas SHALL oferecer busca textual por código ou nome da lista.

#### Scenario: Buscar por código ou nome

- **WHEN** a pessoa usuária digita um texto no campo de busca
- **THEN** somente as listas cujo código ou nome correspondem ao texto permanecem na listagem

### Requirement: Identificação da lista no detalhe

O detalhe de uma lista SHALL exibir e permitir editar código, nome, descrição, propriedade/observável associado e situação da lista (`ftm_list`).

#### Scenario: Abertura do detalhe de uma lista

- **WHEN** a pessoa usuária abre o detalhe de uma lista
- **THEN** código, nome, descrição, observável associado e situação dessa lista são exibidos

### Requirement: Itens da lista com vigência temporal

O detalhe de uma lista SHALL exibir os itens da lista (`ftm_list_item`) com valor do observável, justificativa de inclusão, data de início de vigência e, quando encerrado, justificativa de encerramento e data de término. Por padrão, apenas os itens vigentes (sem data de término) SHALL ser exibidos; a pessoa usuária SHALL poder alternar para exibir também os itens encerrados.

#### Scenario: Exibição padrão dos itens

- **WHEN** a pessoa usuária abre o detalhe de uma lista
- **THEN** somente os itens vigentes dessa lista são exibidos

#### Scenario: Exibir itens encerrados

- **WHEN** a pessoa usuária ativa a exibição de itens encerrados
- **THEN** os itens com vigência encerrada passam a aparecer, cada um com sua justificativa e data de encerramento

### Requirement: Inclusão de um item na lista

O detalhe de uma lista SHALL permitir incluir um novo item, exigindo valor do observável, justificativa de inclusão e data de início de vigência.

#### Scenario: Incluir um item

- **WHEN** a pessoa usuária preenche valor, justificativa e data de início e confirma a inclusão
- **THEN** um novo item vigente aparece na lista de itens

### Requirement: Encerramento de vigência de um item

O detalhe de uma lista SHALL permitir encerrar a vigência de um item vigente, exigindo justificativa de encerramento e data de término. Um item já encerrado SHALL não poder ser encerrado novamente.

#### Scenario: Encerrar um item vigente

- **WHEN** a pessoa usuária preenche justificativa e data de término e confirma o encerramento de um item vigente
- **THEN** esse item passa a aparecer como encerrado, com a justificativa e a data informadas

### Requirement: Regras consumidoras da lista

O detalhe de uma lista SHALL exibir quais regras de alerta consomem essa lista, cada uma com o código da regra, o caminho de propriedade e o operador (`IN_LIST` ou `NOT_IN_LIST`) usados na condição.

#### Scenario: Lista consumida por regras

- **WHEN** a pessoa usuária consulta o detalhe de uma lista que é referenciada por uma ou mais regras
- **THEN** cada regra consumidora aparece com seu código, o caminho de propriedade e o operador usados

#### Scenario: Lista sem regras consumidoras

- **WHEN** a pessoa usuária consulta o detalhe de uma lista que não é referenciada por nenhuma regra
- **THEN** a ausência de regras consumidoras é indicada
