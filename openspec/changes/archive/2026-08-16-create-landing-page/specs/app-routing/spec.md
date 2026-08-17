## MODIFIED Requirements

### Requirement: Separação entre raiz pública e prefixo da aplicação

A raiz do domínio SHALL servir a página institucional pública do produto. Todas as telas da aplicação SHALL viver sob o prefixo `/app`. O painel operacional SHALL ser o índice desse prefixo, respondendo em `/app`. A tela de entrada (login) SHALL viver em `/login`, fora do prefixo `/app`.

#### Scenario: Painel operacional no índice da aplicação

- **WHEN** uma pessoa autenticada acessa `/app`
- **THEN** o painel operacional é exibido

#### Scenario: Telas da aplicação sob o prefixo

- **WHEN** uma pessoa autenticada acessa uma tela da aplicação
- **THEN** a URL dessa tela começa com `/app`

#### Scenario: Rota anterior do painel

- **WHEN** alguém acessa `/dashboard`
- **THEN** a rota não existe

#### Scenario: Área pública sem a moldura da aplicação

- **WHEN** a raiz do domínio é exibida
- **THEN** a barra lateral, a barra superior e o rodapé da aplicação não são renderizados

#### Scenario: Login fora do prefixo da aplicação

- **WHEN** alguém acessa `/login`
- **THEN** a URL não começa com `/app`
