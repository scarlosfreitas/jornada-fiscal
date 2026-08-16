## Purpose

Define como uma pessoa se identifica no Gertor de Alertas e como o sistema controla o acesso às áreas privadas: credenciais, sessão, encerramento e os perfis que a sessão carrega.

## ADDED Requirements

### Requirement: Autenticação por e-mail e senha

O sistema SHALL autenticar a pessoa usuária por e-mail e senha. As credenciais SHALL ser validadas quanto ao formato antes de qualquer consulta à base. A senha SHALL ser conferida contra o hash armazenado; a senha em texto puro SHALL nunca ser persistida, registrada em log ou devolvida em qualquer resposta.

#### Scenario: Credenciais válidas

- **WHEN** a pessoa usuária informa um e-mail cadastrado e a senha correspondente
- **THEN** uma sessão é criada e a pessoa é levada à área da aplicação

#### Scenario: Senha incorreta

- **WHEN** a pessoa usuária informa um e-mail cadastrado com a senha errada
- **THEN** nenhuma sessão é criada e a tela apresenta uma mensagem de erro

#### Scenario: E-mail não cadastrado

- **WHEN** a pessoa usuária informa um e-mail que não existe na base
- **THEN** nenhuma sessão é criada e a mensagem de erro é indistinguível da apresentada para senha incorreta

#### Scenario: Entrada malformada

- **WHEN** o e-mail informado não tem forma de e-mail ou a senha está vazia
- **THEN** o erro é apontado sem que nenhuma consulta à base de usuários seja realizada

#### Scenario: Senha nunca exposta

- **WHEN** qualquer resposta do sistema devolve dados da pessoa usuária autenticada
- **THEN** a senha, em texto puro ou como hash, não está entre esses dados

### Requirement: Sessão da pessoa usuária

O sistema SHALL manter a identificação da pessoa usuária em uma sessão que sobrevive à navegação entre telas e ao recarregamento da página. A sessão SHALL carregar o identificador da pessoa e a lista de perfis que ela possui.

#### Scenario: Sessão preservada na navegação

- **WHEN** a pessoa usuária autenticada navega entre telas da aplicação
- **THEN** permanece autenticada, sem nova solicitação de credenciais

#### Scenario: Sessão preservada no recarregamento

- **WHEN** a pessoa usuária autenticada recarrega a página
- **THEN** permanece autenticada

#### Scenario: Perfis disponíveis na sessão

- **WHEN** a aplicação consulta a sessão de uma pessoa autenticada
- **THEN** obtém o identificador dela e a lista de perfis a ela atribuídos

#### Scenario: Encerramento de sessão

- **WHEN** a pessoa usuária encerra a sessão
- **THEN** deixa de estar autenticada e o acesso à área da aplicação volta a exigir credenciais

### Requirement: Tela de entrada

O sistema SHALL apresentar a tela de entrada na raiz do domínio, usando o design system do produto. A tela SHALL sinalizar o andamento da autenticação e SHALL apresentar as falhas com o tratamento visual de erro do próprio design system.

#### Scenario: Acesso à raiz sem sessão

- **WHEN** uma pessoa sem sessão acessa a raiz do domínio
- **THEN** a tela de entrada é exibida

#### Scenario: Acesso à raiz com sessão

- **WHEN** uma pessoa já autenticada acessa a raiz do domínio
- **THEN** é redirecionada para a área da aplicação, sem ver a tela de entrada

#### Scenario: Autenticação em andamento

- **WHEN** as credenciais foram enviadas e a verificação está em curso
- **THEN** a tela sinaliza o andamento e impede o reenvio do formulário

### Requirement: Proteção das áreas privadas

O sistema SHALL exigir sessão para toda tela sob o prefixo da aplicação. A verificação SHALL ocorrer em duas camadas independentes: antes da renderização da rota e dentro do próprio layout da aplicação. A proteção SHALL alcançar apenas as rotas privadas, sem interferir em recursos estáticos nem nos endpoints de autenticação.

#### Scenario: Acesso sem sessão

- **WHEN** uma pessoa sem sessão acessa qualquer tela sob o prefixo da aplicação
- **THEN** é redirecionada para a tela de entrada, preservando o destino pretendido

#### Scenario: Retorno ao destino pretendido

- **WHEN** essa pessoa se autentica com sucesso
- **THEN** é levada ao destino que tentou acessar originalmente

#### Scenario: Falha da camada externa

- **WHEN** a verificação anterior à renderização não é aplicada por qualquer motivo
- **THEN** o layout da aplicação ainda assim redireciona quem não tem sessão para a tela de entrada

#### Scenario: Recursos estáticos não afetados

- **WHEN** o navegador requisita folhas de estilo, scripts, imagens otimizadas ou arquivos públicos
- **THEN** esses recursos são servidos normalmente, sem passar pela verificação de sessão

#### Scenario: Endpoints de autenticação acessíveis

- **WHEN** a tela de entrada aciona os endpoints de autenticação
- **THEN** esses endpoints respondem sem exigir sessão prévia

### Requirement: Perfis de acesso da pessoa usuária

O sistema SHALL permitir que uma pessoa usuária tenha vários perfis simultaneamente e que novos perfis sejam cadastrados sem alteração de código. O sistema SHALL dispor, desde a instalação, dos cinco perfis iniciais do domínio: Usuário, Administrador, Cadastrador, Bloqueador de Cadastro e Validador de Cadastro.

#### Scenario: Perfis iniciais disponíveis

- **WHEN** a base é inicializada
- **THEN** os cinco perfis iniciais do domínio existem e há ao menos um usuário com o perfil Administrador

#### Scenario: Múltiplos perfis por pessoa

- **WHEN** uma pessoa usuária recebe mais de um perfil
- **THEN** todos os seus perfis ficam associados a ela e disponíveis na sessão

#### Scenario: Novo perfil sem alteração de código

- **WHEN** um novo perfil é cadastrado na base
- **THEN** ele pode ser atribuído a pessoas usuárias sem que o código precise mudar

### Requirement: Dados de identificação da pessoa usuária

O cadastro da pessoa usuária SHALL registrar nome, sobrenome, e-mail único, telefone, imagem de perfil, cargo, lotação, situação do cadastro e as datas de criação e atualização. Cargo e lotação SHALL ser informados no cadastro enquanto não houver integração com o diretório corporativo.

#### Scenario: E-mail único

- **WHEN** se tenta cadastrar uma pessoa com e-mail já existente na base
- **THEN** o cadastro é recusado

#### Scenario: Cargo e lotação informados manualmente

- **WHEN** uma pessoa usuária é cadastrada antes da integração com o diretório corporativo
- **THEN** cargo e lotação podem ser informados diretamente no cadastro
