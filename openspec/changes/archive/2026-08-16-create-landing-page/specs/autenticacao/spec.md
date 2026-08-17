## MODIFIED Requirements

### Requirement: Tela de entrada

O sistema SHALL apresentar a tela de entrada em `/login`, usando o design system do produto. A tela SHALL sinalizar o andamento da autenticação e SHALL apresentar as falhas com o tratamento visual de erro do próprio design system.

#### Scenario: Acesso à raiz sem sessão

- **WHEN** uma pessoa sem sessão acessa `/login`
- **THEN** a tela de entrada é exibida

#### Scenario: Acesso à raiz com sessão

- **WHEN** uma pessoa já autenticada acessa `/login`
- **THEN** é redirecionada para a área da aplicação, sem ver a tela de entrada

#### Scenario: Autenticação em andamento

- **WHEN** as credenciais foram enviadas e a verificação está em curso
- **THEN** a tela sinaliza o andamento e impede o reenvio do formulário
