## Purpose

Permite ao auditor fiscal consultar o catálogo de schemas da ontologia FollowTheMoney (entidades e arestas com vigência), entender a hierarquia de herança entre eles e inspecionar, em cada schema, as propriedades próprias e herdadas que ficam disponíveis para escrever regras de alerta.

## ADDED Requirements

### Requirement: Listagem dos schemas FtM

A tela Entidades SHALL listar os schemas cadastrados (`ftm_schema`), exibindo por schema: nome técnico, rótulo na interface, descrição semântica, schema pai do qual herda, natureza (entidade ou aresta com vigência), quantidade de propriedades próprias, quantidade de propriedades herdadas dos ancestrais, quantidade de propriedades próprias observáveis e quantidade de regras que o usam como schema alvo. Schemas sem pai SHALL exibir "—" na coluna de herança, e schemas sem regras alvo SHALL exibir "—" na respectiva coluna.

#### Scenario: Abertura da listagem

- **WHEN** a pessoa usuária abre a tela Entidades
- **THEN** os schemas cadastrados são exibidos com nome técnico, rótulo, descrição, schema pai, natureza e as contagens de propriedades próprias, herdadas, observáveis e regras alvo

#### Scenario: Schema raiz sem herança

- **WHEN** um schema listado não possui schema pai
- **THEN** a coluna de herança daquele schema exibe "—"

### Requirement: Indicação visual da hierarquia de herança

Na exibição padrão da listagem, cada schema SHALL ser recuado proporcionalmente à sua profundidade na cadeia de herança, de modo que a relação pai-filho seja visível. Quando houver busca ativa ou filtro por natureza aplicado, o recuo SHALL ser suprimido e todos os schemas SHALL ser exibidos no mesmo nível.

#### Scenario: Recuo por profundidade

- **WHEN** a pessoa usuária abre a listagem sem busca e sem filtro de natureza
- **THEN** cada schema aparece recuado de acordo com a quantidade de ancestrais que possui

#### Scenario: Busca suprime o recuo

- **WHEN** a pessoa usuária digita um texto na busca ou seleciona um filtro de natureza
- **THEN** os schemas resultantes são exibidos sem recuo hierárquico

### Requirement: Indicadores agregados da ontologia

A tela Entidades SHALL exibir, acima da listagem, quatro indicadores: total de entidades (schemas que não são arestas), total de arestas com vigência, total de propriedades em situação ativa e total de propriedades marcadas como observáveis.

#### Scenario: Exibição dos indicadores

- **WHEN** a pessoa usuária abre a tela Entidades
- **THEN** os indicadores de entidades, arestas com vigência, propriedades ativas e observáveis são exibidos com seus totais

#### Scenario: Indicador reflete alteração de observabilidade

- **WHEN** a pessoa usuária altera a marcação de observável de uma propriedade
- **THEN** o indicador de observáveis passa a refletir o novo total

### Requirement: Filtro por natureza do schema

A listagem SHALL oferecer três recortes mutuamente exclusivos, cada um com sua contagem: todos os schemas, apenas entidades e apenas arestas com vigência. O recorte "todos os schemas" SHALL ser o padrão ao abrir a tela.

#### Scenario: Recorte padrão

- **WHEN** a pessoa usuária abre a tela Entidades
- **THEN** o recorte "todos os schemas" está selecionado e todos os schemas são listados

#### Scenario: Filtrar apenas arestas

- **WHEN** a pessoa usuária seleciona o recorte de arestas com vigência
- **THEN** somente schemas cuja natureza é aresta permanecem na listagem

### Requirement: Busca na listagem de schemas

A listagem SHALL oferecer busca textual que filtre os schemas por nome técnico, rótulo ou descrição semântica. A busca SHALL ser combinada com o recorte de natureza selecionado.

#### Scenario: Buscar por nome técnico ou rótulo

- **WHEN** a pessoa usuária digita um texto no campo de busca
- **THEN** somente os schemas cujo nome técnico, rótulo ou descrição correspondem ao texto permanecem na listagem

#### Scenario: Busca combinada com recorte

- **WHEN** há um recorte de natureza selecionado e a pessoa usuária digita um texto na busca
- **THEN** apenas os schemas que satisfazem simultaneamente o recorte e o texto são exibidos

### Requirement: Ações por schema na listagem

Cada linha da listagem SHALL oferecer um menu com as ações: abrir o detalhe do schema para edição, cadastrar uma propriedade e ver o contrato do tópico de ingestão. A ação de cadastrar propriedade SHALL levar à tela de Propriedades.

#### Scenario: Abrir o detalhe pelo menu da linha

- **WHEN** a pessoa usuária aciona "Editar entidade e propriedades" no menu de um schema
- **THEN** o detalhe daquele schema é exibido no lugar da listagem

#### Scenario: Cadastrar propriedade a partir da listagem

- **WHEN** a pessoa usuária aciona "Cadastrar propriedade" no menu de um schema
- **THEN** o sistema navega para a tela de Propriedades

#### Scenario: Um menu por vez

- **WHEN** a pessoa usuária abre o menu de uma linha com o menu de outra linha já aberto
- **THEN** apenas o menu recém-acionado permanece aberto

### Requirement: Definição do schema no detalhe

O detalhe de um schema SHALL exibir e permitir editar nome técnico, rótulo na interface, schema pai (herança), natureza (entidade ou aresta com vigência) e descrição semântica. A natureza SHALL ser apresentada como alternância, acompanhada de um texto explicando o efeito da escolha. A lista de schemas pai disponíveis SHALL excluir o próprio schema em edição.

#### Scenario: Abertura do detalhe

- **WHEN** a pessoa usuária abre o detalhe de um schema
- **THEN** nome técnico, rótulo, schema pai, natureza e descrição daquele schema são exibidos preenchidos e editáveis

#### Scenario: Alternar a natureza do schema

- **WHEN** a pessoa usuária alterna a natureza de entidade para aresta com vigência
- **THEN** a alternância passa ao estado ligado e o texto explicativo descreve o relacionamento com datas de início e fim de vigência

#### Scenario: Schema não pode herdar de si mesmo

- **WHEN** a pessoa usuária abre a seleção de schema pai no detalhe de um schema
- **THEN** o próprio schema em edição não aparece entre as opções

### Requirement: Identificação do schema no detalhe

O cabeçalho do detalhe SHALL exibir o rótulo do schema como título, e ao lado dele o nome técnico, a natureza e a cadeia de herança completa do schema até a raiz.

#### Scenario: Cadeia de herança

- **WHEN** a pessoa usuária abre o detalhe de um schema que herda de outros
- **THEN** o cabeçalho exibe a cadeia do schema até a raiz, na ordem do mais específico para o mais genérico

### Requirement: Propriedades próprias no detalhe

O detalhe de um schema SHALL exibir suas propriedades próprias com nome técnico, rótulo, tipo de dado, schema de destino quando a propriedade referencia outra entidade, indicação de cardinalidade múltipla, alternância de observável e seletor de situação. Propriedades em situação suspensa ou arquivada SHALL ser exibidas com destaque reduzido. Um rodapé SHALL resumir a quantidade de propriedades próprias e quantas delas são observáveis.

#### Scenario: Exibição das propriedades próprias

- **WHEN** a pessoa usuária abre o detalhe de um schema
- **THEN** somente as propriedades declaradas nesse schema são exibidas, com tipo, destino, cardinalidade, observabilidade e situação

#### Scenario: Alternar observabilidade de uma propriedade

- **WHEN** a pessoa usuária aciona a alternância de observável de uma propriedade própria
- **THEN** a propriedade passa ao novo estado de observabilidade e as contagens agregadas são atualizadas

#### Scenario: Alterar a situação de uma propriedade

- **WHEN** a pessoa usuária seleciona uma nova situação para uma propriedade própria
- **THEN** a propriedade passa a exibir a nova situação e o sistema confirma a alteração com uma notificação temporária

#### Scenario: Destaque reduzido para propriedade inativa

- **WHEN** uma propriedade própria está suspensa ou arquivada
- **THEN** seu nome técnico é exibido com destaque reduzido em relação às demais

### Requirement: Propriedades herdadas no detalhe

O detalhe de um schema SHALL exibir, em bloco separado e somente leitura, as propriedades herdadas de todos os seus schemas ancestrais, cada uma com nome técnico, rótulo, schema de origem, tipo, indicação de observabilidade e situação. Quando o schema não possuir ancestrais com propriedades, esse bloco SHALL ser omitido.

#### Scenario: Schema com ancestrais

- **WHEN** a pessoa usuária abre o detalhe de um schema cujos ancestrais declaram propriedades
- **THEN** essas propriedades são exibidas em bloco separado, identificando o schema de origem de cada uma, sem controles de edição

#### Scenario: Schema raiz

- **WHEN** a pessoa usuária abre o detalhe de um schema sem ancestrais
- **THEN** o bloco de propriedades herdadas não é exibido

### Requirement: Panorama de situação e ingestão no detalhe

O detalhe de um schema SHALL exibir a distribuição das suas propriedades próprias por situação (em teste, ativa, suspensa, arquivada) com a contagem de cada uma, e os dados de ingestão do schema: tópico de eventos, chave de partição, formato do contrato e mecanismo de enriquecimento. Schemas sem ingestão associada SHALL exibir "—" nos campos de tópico e chave de partição.

#### Scenario: Distribuição por situação

- **WHEN** a pessoa usuária abre o detalhe de um schema
- **THEN** cada situação de propriedade é exibida com a quantidade de propriedades próprias naquela situação

#### Scenario: Schema sem tópico de ingestão

- **WHEN** a pessoa usuária abre o detalhe de um schema que não possui tópico de eventos associado
- **THEN** os campos de tópico e chave de partição exibem "—"

### Requirement: Regras que usam o schema como alvo

O detalhe de um schema SHALL listar as regras de alerta que o utilizam como evento disparador, exibindo código e situação de cada regra. Quando não houver nenhuma, o bloco SHALL informar explicitamente que nenhuma regra usa aquele schema como disparador.

#### Scenario: Schema usado por regras

- **WHEN** a pessoa usuária abre o detalhe de um schema usado como alvo por regras
- **THEN** cada regra é exibida com seu código e sua situação

#### Scenario: Schema sem regras alvo

- **WHEN** a pessoa usuária abre o detalhe de um schema que não é alvo de nenhuma regra
- **THEN** o bloco informa que nenhuma regra usa esse schema como evento disparador

### Requirement: Retorno do detalhe para a listagem

O detalhe de um schema SHALL oferecer um controle de retorno que devolve a pessoa usuária à listagem de schemas, preservando o recorte e a busca que estavam aplicados.

#### Scenario: Voltar para a listagem

- **WHEN** a pessoa usuária aciona o controle de retorno no detalhe de um schema
- **THEN** a listagem de schemas volta a ser exibida com o recorte e a busca anteriores preservados

### Requirement: Navegação entre Entidades e Propriedades

A tela Entidades SHALL oferecer um acesso direto à tela de Propriedades a partir do cabeçalho da listagem.

#### Scenario: Ir para Propriedades

- **WHEN** a pessoa usuária aciona "Ver propriedades" no cabeçalho da tela Entidades
- **THEN** o sistema navega para a tela de Propriedades
