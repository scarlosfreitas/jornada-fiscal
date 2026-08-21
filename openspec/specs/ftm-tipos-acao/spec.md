## Purpose

Permite ao auditor fiscal consultar e manter o catálogo de tipos de ação que uma regra de alerta pode disparar — o canal ou sistema de destino, a severidade padrão, os parâmetros esperados e se a ação está disponível no editor de regras.

## Requirements

### Requirement: Listagem dos tipos de ação

A tela Tipos de Ação SHALL listar as ações cadastradas (`ftm_action`), exibindo por ação: código técnico, nome amigável, descrição do comportamento, integração de destino, severidade padrão, parâmetros esperados, quantidade de regras que a utilizam, quantidade de disparos acumulados e se está habilitada no editor de regras. Ações sem regras vinculadas ou sem disparos SHALL exibir "—" nos respectivos campos.

#### Scenario: Abertura da listagem

- **WHEN** a pessoa usuária abre a tela Tipos de Ação
- **THEN** as ações cadastradas são exibidas com código, nome, descrição, integração, severidade, parâmetros, regras, disparos e situação de habilitação

#### Scenario: Ação sem uso

- **WHEN** uma ação listada não é usada por nenhuma regra e nunca foi disparada
- **THEN** as colunas de regras e disparos daquela ação exibem "—"

#### Scenario: Parâmetros esperados

- **WHEN** uma ação declara parâmetros esperados
- **THEN** cada parâmetro é exibido individualmente na linha daquela ação

### Requirement: Recortes da listagem de tipos de ação

A listagem SHALL oferecer três recortes mutuamente exclusivos, cada um com sua contagem: todos os tipos de ação, apenas os habilitados e apenas os desabilitados. O recorte "todos" SHALL ser o padrão ao abrir a tela.

#### Scenario: Recorte padrão

- **WHEN** a pessoa usuária abre a tela Tipos de Ação
- **THEN** o recorte "todos" está selecionado e todas as ações são listadas

#### Scenario: Recorte de desabilitados

- **WHEN** a pessoa usuária seleciona o recorte de desabilitados
- **THEN** somente as ações não habilitadas no editor de regras permanecem na listagem

### Requirement: Busca na listagem de tipos de ação

A listagem SHALL oferecer busca textual que filtre as ações por código, nome, descrição, integração de destino ou parâmetros. A busca SHALL ser combinada com o recorte selecionado.

#### Scenario: Buscar por código ou integração

- **WHEN** a pessoa usuária digita um texto no campo de busca
- **THEN** somente as ações cujo código, nome, descrição, integração ou parâmetros correspondem ao texto permanecem na listagem

### Requirement: Ações por linha no catálogo

Cada linha da listagem SHALL oferecer um menu com as ações: editar o tipo de ação, enviar um disparo de teste pela integração de destino, ver as regras vinculadas e desabilitar a ação. Desabilitar SHALL marcar a ação como indisponível para novas regras e confirmar a operação por notificação temporária. Ver regras vinculadas SHALL navegar para a tela de Regras.

#### Scenario: Desabilitar um tipo de ação

- **WHEN** a pessoa usuária aciona "Desabilitar" no menu de uma ação habilitada
- **THEN** a ação passa a constar como desabilitada, as contagens dos recortes são atualizadas e uma notificação temporária confirma a operação

#### Scenario: Disparo de teste

- **WHEN** a pessoa usuária aciona "Disparo de teste" no menu de uma ação
- **THEN** uma notificação temporária confirma o envio do teste identificando a integração de destino

#### Scenario: Ver regras vinculadas

- **WHEN** a pessoa usuária aciona "Ver regras vinculadas" no menu de uma ação
- **THEN** o sistema navega para a tela de Regras

#### Scenario: Um menu por vez

- **WHEN** a pessoa usuária abre o menu de uma linha com o menu de outra linha já aberto
- **THEN** apenas o menu recém-acionado permanece aberto

### Requirement: Cadastro e edição de tipo de ação

A tela SHALL oferecer um formulário, aberto sobre a listagem, para cadastrar um novo tipo de ação ou editar um existente. O formulário SHALL conter código da ação, nome amigável, descrição do comportamento e integrações acionadas, integração de destino, severidade padrão, parâmetros esperados separados por vírgula e alternância de habilitação no editor de regras, acompanhada de texto explicando o efeito do estado atual. O código SHALL ser normalizado para maiúsculas, aceitando apenas letras, dígitos e sublinhado. O formulário SHALL indicar se está criando ou editando, identificando neste último caso a ação em edição.

#### Scenario: Abrir o formulário de cadastro

- **WHEN** a pessoa usuária aciona "Criar ação"
- **THEN** o formulário é exibido em branco, identificado como nova entrada no catálogo de ações

#### Scenario: Abrir o formulário de edição

- **WHEN** a pessoa usuária aciona "Editar tipo de ação" no menu de uma linha
- **THEN** o formulário é exibido com os dados daquela ação preenchidos e identificado como edição

#### Scenario: Normalização do código

- **WHEN** a pessoa usuária digita o código da ação em minúsculas ou com caracteres não permitidos
- **THEN** o valor exibido é convertido para maiúsculas e os caracteres não permitidos são substituídos por sublinhado

### Requirement: Validação e confirmação do formulário de tipo de ação

Ao salvar, o sistema SHALL exigir código e nome preenchidos; se algum estiver vazio, SHALL informar a exigência por notificação temporária e manter o formulário aberto sem gravar. Ao salvar com sucesso, o sistema SHALL fechar o formulário, refletir a ação na listagem e confirmar a operação por notificação temporária. Ações recém-cadastradas SHALL iniciar sem regras vinculadas e sem disparos.

#### Scenario: Campos obrigatórios ausentes

- **WHEN** a pessoa usuária aciona salvar com código ou nome vazio
- **THEN** uma notificação temporária informa que ambos são obrigatórios e o formulário permanece aberto sem gravar

#### Scenario: Cadastro concluído

- **WHEN** a pessoa usuária salva um novo tipo de ação válido
- **THEN** o formulário é fechado, a ação passa a constar na listagem sem regras vinculadas nem disparos, e uma notificação temporária confirma o cadastro

#### Scenario: Edição concluída

- **WHEN** a pessoa usuária salva a edição de um tipo de ação existente
- **THEN** o formulário é fechado, os dados atualizados aparecem na listagem e uma notificação temporária confirma a atualização

#### Scenario: Cancelar o formulário

- **WHEN** a pessoa usuária cancela ou fecha o formulário
- **THEN** o formulário é descartado sem gravar alterações e a listagem permanece inalterada

### Requirement: Pré-visualização do trecho na árvore da regra

Enquanto o formulário estiver aberto, o sistema SHALL exibir uma pré-visualização do trecho correspondente à ação na árvore de definição da regra, contendo o código da ação, a severidade padrão e os parâmetros declarados. A pré-visualização SHALL ser recalculada a cada alteração desses campos.

#### Scenario: Pré-visualização acompanha os parâmetros

- **WHEN** a pessoa usuária altera os parâmetros esperados no formulário
- **THEN** a pré-visualização passa a listar os parâmetros informados

#### Scenario: Pré-visualização acompanha a severidade

- **WHEN** a pessoa usuária altera a severidade padrão no formulário
- **THEN** a pré-visualização passa a refletir a nova severidade
