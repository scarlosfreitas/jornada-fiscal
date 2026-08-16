## Purpose

Permite que a pessoa usuária autenticada visualize e mantenha atualizados os próprios dados cadastrais — nome, sobrenome, e-mail, telefone e imagem de perfil — sem depender de outra pessoa nem poder alterar sua senha ou seu perfil de acesso por essa via.

## ADDED Requirements

### Requirement: Visualização dos próprios dados cadastrais

O sistema SHALL apresentar, na tela de perfil, os dados cadastrais da pessoa usuária autenticada — nome, sobrenome, e-mail, telefone e imagem de perfil — obtidos a partir da sessão e da base. A senha SHALL nunca ser exibida ou pré-preenchida nessa tela.

#### Scenario: Abertura da tela de perfil

- **WHEN** a pessoa usuária autenticada abre a tela de perfil
- **THEN** o formulário aparece pré-preenchido com o nome, sobrenome, e-mail, telefone e imagem atuais dela, sem qualquer campo de senha

#### Scenario: Acesso exige sessão

- **WHEN** uma pessoa sem sessão tenta acessar a tela de perfil
- **THEN** é redirecionada à tela de entrada, como qualquer outra tela sob o prefixo da aplicação

### Requirement: Atualização dos próprios dados cadastrais

O sistema SHALL permitir que a pessoa usuária autenticada atualize seu nome, sobrenome, e-mail, telefone e imagem de perfil. A identidade da pessoa a ser atualizada SHALL ser determinada pela sessão no servidor, nunca por um identificador enviado pelo cliente — a pessoa usuária SHALL só conseguir alterar o próprio cadastro. Um e-mail alterado para um já usado por outra pessoa SHALL ser recusado. Essa operação SHALL não alterar a senha da pessoa usuária.

#### Scenario: Atualização bem-sucedida

- **WHEN** a pessoa usuária autenticada altera um ou mais dos campos permitidos e confirma
- **THEN** o cadastro dela é atualizado, a tela mostra confirmação de sucesso e os dados exibidos passam a refletir os novos valores, inclusive nome e iniciais na barra superior

#### Scenario: E-mail já utilizado

- **WHEN** a pessoa usuária tenta salvar um e-mail já usado por outra pessoa cadastrada
- **THEN** a atualização é recusada e a tela indica que o e-mail já está em uso

#### Scenario: Identidade determinada pela sessão

- **WHEN** a atualização é processada
- **THEN** o cadastro alterado é sempre o da pessoa dona da sessão que fez a requisição, independentemente de qualquer identificador presente na submissão

#### Scenario: Senha não é alterada por essa tela

- **WHEN** a pessoa usuária salva alterações na tela de perfil
- **THEN** a senha cadastrada permanece a mesma

### Requirement: Perfil de acesso não é editável na tela de perfil

A tela de perfil SHALL não permitir que a pessoa usuária altere seu próprio perfil de acesso. Qualquer valor de perfil de acesso enviado nessa submissão SHALL ser ignorado pelo sistema.

#### Scenario: Perfil de acesso não editável

- **WHEN** a pessoa usuária visualiza a tela de perfil
- **THEN** não há controle nessa tela que permita selecionar ou alterar seu próprio perfil de acesso

#### Scenario: Valor de perfil de acesso forjado é ignorado

- **WHEN** uma submissão de atualização do próprio perfil chega ao sistema contendo um valor de perfil de acesso
- **THEN** esse valor é ignorado e os perfis de acesso da pessoa usuária permanecem inalterados
