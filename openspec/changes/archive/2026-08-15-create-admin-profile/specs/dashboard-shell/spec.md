## MODIFIED Requirements

### Requirement: Notificações e identificação do usuário na barra superior

A barra superior SHALL exibir um acesso a notificações e a identificação da pessoa usuária autenticada com iniciais, nome e perfil. O acesso a notificações SHALL sinalizar visualmente a existência de notificações não lidas. As iniciais e o nome exibidos SHALL corresponder à pessoa usuária da sessão autenticada, nunca a um valor fixo.

O menu do usuário SHALL oferecer três acessos, cada um com ícone: Perfil, Alterar senha e Sair. Perfil e Alterar senha SHALL navegar para as telas correspondentes. Sair SHALL encerrar a sessão da pessoa usuária e levá-la à tela de entrada.

#### Scenario: Sinalização de notificações pendentes

- **WHEN** existem notificações não lidas
- **THEN** o acesso a notificações exibe um indicador visual de pendência

#### Scenario: Identificação da pessoa usuária

- **WHEN** uma tela do produto é exibida
- **THEN** a barra superior mostra as iniciais e o nome da pessoa usuária autenticada, obtidos da sessão

#### Scenario: Abrir o menu do usuário

- **WHEN** a pessoa usuária aciona a área de identificação
- **THEN** o menu do usuário é exibido, com os acessos Perfil, Alterar senha e Sair

#### Scenario: Fechar o menu do usuário

- **WHEN** a pessoa usuária aciona a área de identificação novamente, pressiona `Esc` ou aciona a área fora do menu
- **THEN** o menu do usuário é fechado

#### Scenario: Selecionar Perfil

- **WHEN** a pessoa usuária aciona o item Perfil no menu do usuário
- **THEN** o sistema navega para a tela de perfil e o menu do usuário é fechado

#### Scenario: Selecionar Alterar senha

- **WHEN** a pessoa usuária aciona o item Alterar senha no menu do usuário
- **THEN** o sistema navega para a tela de alteração de senha e o menu do usuário é fechado

#### Scenario: Selecionar Sair

- **WHEN** a pessoa usuária aciona o item Sair no menu do usuário
- **THEN** a sessão é encerrada, o menu do usuário é fechado e a pessoa é levada à tela de entrada
