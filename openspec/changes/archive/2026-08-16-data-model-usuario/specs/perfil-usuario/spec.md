## MODIFIED Requirements

### Requirement: Visualização dos próprios dados cadastrais

O sistema SHALL apresentar, na tela de perfil, os dados cadastrais da pessoa usuária autenticada — nome completo, e-mail, telefone, imagem de perfil e cargo vigente — obtidos a partir da sessão e da base. A senha SHALL nunca ser exibida ou pré-preenchida nessa tela.

#### Scenario: Abertura da tela de perfil

- **WHEN** a pessoa usuária autenticada abre a tela de perfil
- **THEN** o formulário aparece pré-preenchido com o nome completo, e-mail, telefone, imagem e cargo vigente dela, sem qualquer campo de senha

#### Scenario: Pessoa usuária sem cargo

- **WHEN** a pessoa usuária autenticada ainda não possui cargo registrado
- **THEN** a tela de perfil é exibida normalmente, com o campo de cargo vazio e aguardando preenchimento

#### Scenario: Acesso exige sessão

- **WHEN** uma pessoa sem sessão tenta acessar a tela de perfil
- **THEN** é redirecionada à tela de entrada, como qualquer outra tela sob o prefixo da aplicação

### Requirement: Atualização dos próprios dados cadastrais

O sistema SHALL permitir que a pessoa usuária autenticada atualize seu nome completo, e-mail, telefone, imagem de perfil e cargo. A identidade da pessoa a ser atualizada SHALL ser determinada pela sessão no servidor, nunca por um identificador enviado pelo cliente — a pessoa usuária SHALL só conseguir alterar o próprio cadastro. Um e-mail alterado para um já usado por outra pessoa SHALL ser recusado. Toda atualização SHALL exigir cargo informado. Essa operação SHALL não alterar a senha da pessoa usuária.

#### Scenario: Atualização bem-sucedida

- **WHEN** a pessoa usuária autenticada altera um ou mais dos campos permitidos, com cargo informado, e confirma
- **THEN** o cadastro dela é atualizado, a tela mostra confirmação de sucesso e os dados exibidos passam a refletir os novos valores, inclusive nome, iniciais e cargo na barra superior

#### Scenario: Atualização sem cargo informado

- **WHEN** a pessoa usuária tenta salvar alterações sem informar cargo
- **THEN** a atualização é recusada e a tela indica que o cargo é obrigatório

#### Scenario: E-mail já utilizado

- **WHEN** a pessoa usuária tenta salvar um e-mail já usado por outra pessoa cadastrada
- **THEN** a atualização é recusada e a tela indica que o e-mail já está em uso

#### Scenario: Identidade determinada pela sessão

- **WHEN** a atualização é processada
- **THEN** o cadastro alterado é sempre o da pessoa dona da sessão que fez a requisição, independentemente de qualquer identificador presente na submissão

#### Scenario: Senha não é alterada por essa tela

- **WHEN** a pessoa usuária salva alterações na tela de perfil
- **THEN** a senha cadastrada permanece a mesma

## ADDED Requirements

### Requirement: Um único cargo efetivo vigente

Uma pessoa usuária SHALL ter no máximo um cargo efetivo vigente por vez, e SHALL poder ter nenhum ou vários cargos comissionados vigentes. Ao registrar um novo cargo efetivo, o cargo efetivo anterior SHALL ser encerrado, preservando o histórico.

#### Scenario: Substituição do cargo efetivo

- **WHEN** um novo cargo efetivo é registrado para uma pessoa que já possui um cargo efetivo vigente
- **THEN** o cargo efetivo anterior é encerrado e apenas o novo permanece vigente

#### Scenario: Vários cargos comissionados

- **WHEN** uma pessoa usuária recebe mais de um cargo comissionado
- **THEN** todos permanecem vigentes simultaneamente

#### Scenario: Apenas cargo comissionado

- **WHEN** uma pessoa usuária possui cargo comissionado e nenhum cargo efetivo
- **THEN** essa situação é aceita pelo sistema
