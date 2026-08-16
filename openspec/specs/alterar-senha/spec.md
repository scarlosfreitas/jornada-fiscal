# alterar-senha Specification

## Purpose
Permite que a pessoa usuária autenticada troque sua própria senha, com a senha atual sempre conferida antes de qualquer alteração e a nova senha submetida a regras mínimas de robustez.

## Requirements

### Requirement: Troca da própria senha

O sistema SHALL permitir que a pessoa usuária autenticada troque sua própria senha informando a senha atual, a nova senha e a confirmação da nova senha. A identidade da pessoa SHALL ser determinada pela sessão no servidor, nunca por um identificador enviado pelo cliente. A senha atual SHALL ser conferida contra o hash armazenado antes de qualquer gravação; nenhuma alteração SHALL ocorrer se a senha atual informada estiver incorreta.

#### Scenario: Troca bem-sucedida

- **WHEN** a pessoa usuária autenticada informa a senha atual correta, uma nova senha válida e a confirmação idêntica
- **THEN** a senha é atualizada, o formulário é limpo e uma confirmação de sucesso é exibida

#### Scenario: Senha atual incorreta

- **WHEN** a senha atual informada não corresponde à senha cadastrada
- **THEN** nenhuma alteração é feita e o sistema indica que a senha atual está incorreta

#### Scenario: Identidade determinada pela sessão

- **WHEN** a troca de senha é processada
- **THEN** a senha alterada é sempre a da pessoa dona da sessão que fez a requisição, independentemente de qualquer identificador presente na submissão

#### Scenario: Acesso exige sessão

- **WHEN** uma pessoa sem sessão tenta acessar a tela de troca de senha
- **THEN** é redirecionada à tela de entrada, como qualquer outra tela sob o prefixo da aplicação

### Requirement: Validação da nova senha

O sistema SHALL exigir que a nova senha tenha ao menos 8 caracteres, que a confirmação seja idêntica à nova senha, e que a nova senha seja diferente da senha atual. Qualquer uma dessas condições não atendida SHALL impedir a troca.

#### Scenario: Nova senha curta demais

- **WHEN** a nova senha informada tem menos de 8 caracteres
- **THEN** a troca é recusada e o sistema indica o requisito de tamanho mínimo

#### Scenario: Confirmação não confere

- **WHEN** a confirmação da nova senha é diferente da nova senha informada
- **THEN** a troca é recusada e o sistema indica que as senhas não conferem

#### Scenario: Nova senha igual à atual

- **WHEN** a nova senha informada é idêntica à senha atual
- **THEN** a troca é recusada e o sistema indica que a nova senha deve ser diferente da atual

### Requirement: Senha nunca exposta na troca

Nenhuma resposta relacionada à troca de senha SHALL conter a senha atual, a nova senha ou qualquer hash, em texto puro ou não, e nenhum desses valores SHALL ser registrado em log.

#### Scenario: Resposta de sucesso sem dado sensível

- **WHEN** a troca de senha é concluída com sucesso
- **THEN** a confirmação exibida não contém a senha atual nem a nova senha

#### Scenario: Resposta de erro sem dado sensível

- **WHEN** a troca de senha é recusada por qualquer motivo
- **THEN** a mensagem de erro não contém a senha atual nem a nova senha
