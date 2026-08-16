## MODIFIED Requirements

### Requirement: Autenticação por e-mail e senha

O sistema SHALL autenticar a pessoa usuária por senha, aceitando como identificador tanto o e-mail quanto o nome de usuário. As credenciais SHALL ser validadas quanto ao formato antes de qualquer consulta à base. A senha SHALL ser conferida contra o hash armazenado; a senha em texto puro SHALL nunca ser persistida, registrada em log ou devolvida em qualquer resposta.

#### Scenario: Credenciais válidas

- **WHEN** a pessoa usuária informa um e-mail cadastrado e a senha correspondente
- **THEN** uma sessão é criada e a pessoa é levada à área da aplicação

#### Scenario: Credenciais válidas por nome de usuário

- **WHEN** a pessoa usuária informa um nome de usuário cadastrado e a senha correspondente
- **THEN** uma sessão é criada e a pessoa é levada à área da aplicação

#### Scenario: Senha incorreta

- **WHEN** a pessoa usuária informa um identificador cadastrado com a senha errada
- **THEN** nenhuma sessão é criada e a tela apresenta uma mensagem de erro

#### Scenario: E-mail não cadastrado

- **WHEN** a pessoa usuária informa um e-mail que não existe na base
- **THEN** nenhuma sessão é criada e a mensagem de erro é indistinguível da apresentada para senha incorreta

#### Scenario: Nome de usuário não cadastrado

- **WHEN** a pessoa usuária informa um nome de usuário que não existe na base
- **THEN** nenhuma sessão é criada e a mensagem de erro é indistinguível da apresentada para senha incorreta

#### Scenario: Entrada malformada

- **WHEN** o identificador informado está vazio ou a senha está vazia
- **THEN** o erro é apontado sem que nenhuma consulta à base de usuários seja realizada

#### Scenario: Senha nunca exposta

- **WHEN** qualquer resposta do sistema devolve dados da pessoa usuária autenticada
- **THEN** a senha, em texto puro ou como hash, não está entre esses dados

### Requirement: Perfis de acesso da pessoa usuária

O sistema SHALL permitir que uma pessoa usuária tenha vários perfis simultaneamente e que novos perfis sejam cadastrados sem alteração de código. Cada perfil SHALL reunir um conjunto de funcionalidades, com vigência, e novas funcionalidades SHALL poder ser associadas a um perfil sem alteração de código. O perfil Administrador SHALL ter acesso a todas as funcionalidades, independentemente das associações registradas.

#### Scenario: Perfis iniciais disponíveis

- **WHEN** a base é inicializada
- **THEN** os perfis iniciais do domínio existem — entre eles Usuário, Administrador, Cadastrador, Bloqueador e Validador — e há ao menos uma pessoa usuária com o perfil Administrador

#### Scenario: Múltiplos perfis por pessoa

- **WHEN** uma pessoa usuária recebe mais de um perfil
- **THEN** todos os seus perfis ficam associados a ela e disponíveis na sessão

#### Scenario: Novo perfil sem alteração de código

- **WHEN** um novo perfil é cadastrado na base
- **THEN** ele pode ser atribuído a pessoas usuárias sem que o código precise mudar

#### Scenario: Funcionalidades de um perfil

- **WHEN** o sistema verifica se um perfil dá acesso a uma funcionalidade
- **THEN** considera apenas as associações vigentes entre aquele perfil e aquela funcionalidade

#### Scenario: Acesso total do Administrador

- **WHEN** o sistema verifica o acesso de uma pessoa que possui o perfil Administrador
- **THEN** o acesso é concedido sem consultar as associações entre perfil e funcionalidade

### Requirement: Dados de identificação da pessoa usuária

O cadastro da pessoa usuária SHALL registrar nome completo, nome de usuário único, e-mail único, e-mail secundário, telefone, imagem de perfil, origem do cadastro e as datas de criação e atualização. Cargo, lotação, perfis de acesso e situação do cadastro SHALL ser registrados como vínculos com vigência, preservando o histórico. Todo registro SHALL guardar quem o criou e quem o atualizou pela última vez, e SHALL poder ser removido logicamente sem perda do histórico.

#### Scenario: E-mail único

- **WHEN** se tenta cadastrar uma pessoa com e-mail já existente na base
- **THEN** o cadastro é recusado

#### Scenario: Nome de usuário único

- **WHEN** se tenta cadastrar uma pessoa com nome de usuário já existente na base
- **THEN** o cadastro é recusado

#### Scenario: Cargo e lotação informados manualmente

- **WHEN** uma pessoa usuária é cadastrada antes da integração com o diretório corporativo
- **THEN** cargo e lotação podem ser informados diretamente no cadastro

#### Scenario: Histórico de cargo preservado

- **WHEN** o cargo de uma pessoa usuária muda
- **THEN** o vínculo anterior é encerrado com data de fim de vigência e o novo passa a vigorar, permanecendo ambos consultáveis

#### Scenario: Situação do cadastro com histórico

- **WHEN** a situação do cadastro de uma pessoa usuária muda
- **THEN** a situação anterior é encerrada e a nova passa a vigorar, permanecendo o histórico consultável

#### Scenario: Remoção lógica

- **WHEN** um registro é removido
- **THEN** ele deixa de ser considerado válido pelo sistema, mas permanece na base para fins de histórico
