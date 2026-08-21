## Purpose

Permite ao auditor fiscal consultar o catálogo completo de propriedades da ontologia FollowTheMoney — os fatos e relacionamentos que podem ser referenciados nas condições das regras de alerta — e gerenciar o tipo, a cardinalidade, a observabilidade e a situação de cada propriedade.

## ADDED Requirements

### Requirement: Listagem das propriedades FtM

A tela Propriedades SHALL listar as propriedades cadastradas (`ftm_property`), exibindo por propriedade: nome técnico, rótulo na interface, schema proprietário, tipo de dado, schema de destino quando o tipo é referência a entidade, indicação de cardinalidade múltipla, alternância de observável, situação e quantidade de regras que a utilizam. Propriedades em situação suspensa ou arquivada SHALL ser exibidas com destaque reduzido, e propriedades sem uso em regras SHALL exibir "—" na coluna de usos.

#### Scenario: Abertura da listagem

- **WHEN** a pessoa usuária abre a tela Propriedades
- **THEN** as propriedades cadastradas são exibidas com nome técnico, rótulo, schema, tipo, cardinalidade, observabilidade, situação e usos

#### Scenario: Propriedade que referencia outra entidade

- **WHEN** uma propriedade listada tem tipo referência a entidade
- **THEN** o schema de destino dessa propriedade é exibido junto ao tipo

#### Scenario: Destaque reduzido para propriedade inativa

- **WHEN** uma propriedade está suspensa ou arquivada
- **THEN** seu nome técnico é exibido com destaque reduzido em relação às demais

### Requirement: Recortes da listagem de propriedades

A listagem SHALL oferecer quatro recortes mutuamente exclusivos, cada um com sua contagem: todas as propriedades, apenas observáveis, apenas relacionamentos (tipo referência a entidade) e apenas suspensas ou arquivadas. O recorte "todas" SHALL ser o padrão ao abrir a tela.

#### Scenario: Recorte padrão

- **WHEN** a pessoa usuária abre a tela Propriedades
- **THEN** o recorte "todas" está selecionado e todas as propriedades são listadas

#### Scenario: Recorte de observáveis

- **WHEN** a pessoa usuária seleciona o recorte de observáveis
- **THEN** somente as propriedades marcadas como observáveis permanecem na listagem

#### Scenario: Recorte de suspensas e arquivadas

- **WHEN** a pessoa usuária seleciona o recorte de suspensas e arquivadas
- **THEN** somente propriedades nessas duas situações permanecem na listagem

### Requirement: Filtros por schema e por tipo de dado

A listagem SHALL oferecer um filtro por schema proprietário e um filtro por tipo de dado, cada um com uma opção que desativa o filtro. Os filtros SHALL ser combináveis entre si, com o recorte selecionado e com a busca textual.

#### Scenario: Filtrar por schema

- **WHEN** a pessoa usuária seleciona um schema no filtro de schema
- **THEN** somente as propriedades declaradas nesse schema permanecem na listagem

#### Scenario: Filtrar por tipo de dado

- **WHEN** a pessoa usuária seleciona um tipo no filtro de tipo de dado
- **THEN** somente as propriedades daquele tipo permanecem na listagem

#### Scenario: Filtros combinados

- **WHEN** a pessoa usuária aplica simultaneamente recorte, filtro de schema, filtro de tipo e busca
- **THEN** apenas as propriedades que satisfazem todos os critérios ao mesmo tempo são exibidas

### Requirement: Busca na listagem de propriedades

A listagem SHALL oferecer busca textual que filtre as propriedades por nome técnico, rótulo, descrição ou nome do schema proprietário.

#### Scenario: Buscar por nome técnico ou rótulo

- **WHEN** a pessoa usuária digita um texto no campo de busca
- **THEN** somente as propriedades cujo nome técnico, rótulo, descrição ou schema correspondem ao texto permanecem na listagem

### Requirement: Totalização do recorte exibido

A listagem SHALL informar quantas propriedades estão sendo exibidas no recorte atual, quantas existem no catálogo inteiro e quantas das exibidas são observáveis.

#### Scenario: Totais após filtrar

- **WHEN** a pessoa usuária aplica um filtro ou busca
- **THEN** a totalização passa a informar a quantidade exibida no recorte atual, o total do catálogo e quantas das exibidas são observáveis

### Requirement: Alternância de observabilidade na listagem

Cada linha da listagem SHALL permitir marcar ou desmarcar a propriedade como observável investigativo diretamente, sem abrir o formulário de edição.

#### Scenario: Marcar propriedade como observável

- **WHEN** a pessoa usuária aciona a alternância de observável de uma propriedade não observável
- **THEN** a propriedade passa a constar como observável e as contagens dos recortes e da totalização são atualizadas

### Requirement: Alteração de situação pelo menu da linha

Cada linha da listagem SHALL oferecer um menu com as ações de editar a propriedade e de mudar sua situação para em teste, ativa, suspensa ou arquivada. Ao mudar a situação, o sistema SHALL confirmar a alteração com uma notificação temporária e fechar o menu.

#### Scenario: Suspender uma propriedade

- **WHEN** a pessoa usuária aciona "Suspender" no menu de uma propriedade
- **THEN** a propriedade passa à situação suspensa, o menu é fechado e uma notificação temporária confirma a alteração

#### Scenario: Um menu por vez

- **WHEN** a pessoa usuária abre o menu de uma linha com o menu de outra linha já aberto
- **THEN** apenas o menu recém-acionado permanece aberto

### Requirement: Cadastro e edição de propriedade

A tela SHALL oferecer um formulário, aberto sobre a listagem, para cadastrar uma nova propriedade ou editar uma existente. O formulário SHALL conter schema proprietário, nome técnico em camelCase, rótulo na interface, descrição fiscal e origem do dado, tipo de dado, alternância de cardinalidade múltipla, alternância de observável e situação. O campo de schema de destino SHALL ser exibido somente quando o tipo selecionado for referência a entidade, e o valor de destino SHALL ser descartado quando o tipo não for de referência. O formulário SHALL indicar se está criando ou editando, identificando neste último caso a propriedade em edição.

#### Scenario: Abrir o formulário de cadastro

- **WHEN** a pessoa usuária aciona "Cadastrar propriedade"
- **THEN** o formulário é exibido em branco, identificado como cadastro de nova propriedade

#### Scenario: Abrir o formulário de edição

- **WHEN** a pessoa usuária aciona "Editar propriedade" no menu de uma linha
- **THEN** o formulário é exibido com os dados daquela propriedade preenchidos e identificado como edição

#### Scenario: Campo de destino condicionado ao tipo

- **WHEN** a pessoa usuária seleciona o tipo referência a entidade no formulário
- **THEN** o campo de schema de destino passa a ser exibido

#### Scenario: Destino descartado em tipo não referencial

- **WHEN** a pessoa usuária salva uma propriedade cujo tipo não é referência a entidade
- **THEN** a propriedade é gravada sem schema de destino

### Requirement: Validação e confirmação do formulário de propriedade

Ao salvar, o sistema SHALL exigir nome técnico e rótulo preenchidos; se algum estiver vazio, SHALL informar a exigência por notificação temporária e manter o formulário aberto sem gravar. Ao salvar com sucesso, o sistema SHALL fechar o formulário, refletir a propriedade na listagem e confirmar a operação por notificação temporária.

#### Scenario: Campos obrigatórios ausentes

- **WHEN** a pessoa usuária aciona salvar com nome técnico ou rótulo vazio
- **THEN** uma notificação temporária informa que ambos são obrigatórios e o formulário permanece aberto sem gravar

#### Scenario: Cadastro concluído

- **WHEN** a pessoa usuária salva uma nova propriedade válida
- **THEN** o formulário é fechado, a propriedade passa a constar na listagem e uma notificação temporária confirma o cadastro indicando o schema em que foi criada

#### Scenario: Edição concluída

- **WHEN** a pessoa usuária salva a edição de uma propriedade existente
- **THEN** o formulário é fechado, os dados atualizados aparecem na listagem e uma notificação temporária confirma a atualização

#### Scenario: Cancelar o formulário

- **WHEN** a pessoa usuária cancela ou fecha o formulário
- **THEN** o formulário é descartado sem gravar alterações e a listagem permanece inalterada

### Requirement: Pré-visualização do caminho e dos operadores compatíveis

Enquanto o formulário estiver aberto, o sistema SHALL exibir o caminho pelo qual a propriedade será referenciada nas regras, composto pelo schema proprietário e pelo nome técnico, e a lista de operadores compatíveis com o tipo de dado selecionado. Ambos SHALL ser recalculados a cada alteração dos campos correspondentes.

#### Scenario: Caminho da propriedade

- **WHEN** a pessoa usuária preenche schema proprietário e nome técnico no formulário
- **THEN** o caminho de referência em regras é exibido combinando o schema e o nome técnico informados

#### Scenario: Operadores mudam com o tipo

- **WHEN** a pessoa usuária altera o tipo de dado no formulário
- **THEN** a lista de operadores compatíveis passa a exibir apenas os operadores admitidos para o novo tipo

### Requirement: Navegação entre Propriedades e Entidades

A tela Propriedades SHALL oferecer um acesso direto à tela de Entidades a partir do cabeçalho.

#### Scenario: Ir para Entidades

- **WHEN** a pessoa usuária aciona "Ver entidades" no cabeçalho da tela Propriedades
- **THEN** o sistema navega para a tela de Entidades
