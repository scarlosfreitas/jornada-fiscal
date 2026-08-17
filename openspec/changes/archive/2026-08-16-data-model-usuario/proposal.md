## Why

Dois documentos novos em `references/domain/` — `data-model-usuario.md` e `seed-usuario.md` — redefinem o domínio de usuário do zero, com 15 tabelas. O schema atual tem apenas 3 models e é incompatível em quase tudo: identificadores `cuid()` em vez de UUIDv7, `nome`+`sobrenome` separados em vez de nome completo único, hashes bcrypt em vez de Argon2id, e sem auditoria, soft-delete, situação do cadastro, cargo, lotação ou funcionalidades como entidades próprias.

Como as telas `/app/profile` e `/app/change-password` foram construídas sobre o modelo antigo, elas deixam de funcionar com o modelo novo e precisam ser corrigidas na mesma change.

## What Changes

- **Modelo de dados** reescrito com as 15 tabelas dos documentos de referência: núcleo (`Usuario`, `Usuario_Origem`, `Situacao`, `Usuario_Situacao`), organização (`Cargo`, `Usuario_Cargo`, `Setor`, `Usuario_Lotacao`), autorização (`Perfil`, `Funcionalidade`, `Func_Categoria`, `Perfil_Funcionalidade`, `Usuario_Perfil`) e integração (`Sistema`, `Usuario_id_externo`). Toda tabela ganha colunas de auditoria e soft-delete; as tabelas de vínculo ganham vigência.
- **BREAKING** — `nome` e `sobrenome` viram um único campo de nome completo.
- **BREAKING** — a autenticação passa a aceitar **e-mail ou nome de usuário** como credencial, e o hash de senha passa de bcrypt para **Argon2id**. As senhas existentes deixam de ser verificáveis; o banco é recriado do zero com o seed novo.
- **Cargo e lotação** deixam de ser texto livre no cadastro e passam a ser vínculos com vigência. Uma pessoa tem no máximo um cargo efetivo ativo e zero ou vários comissionados.
- **Situação do cadastro** passa a ser histórico com vigência (`Usuario_Situacao`), suportando os estados Criado, Bloqueado, Ativo e Encerrado.
- A barra superior deixa de exibir o texto fixo "Coordenação" e passa a exibir o cargo vigente real da pessoa.
- A tela de perfil passa a exigir cargo informado ao salvar qualquer alteração.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `autenticacao`: credencial passa a aceitar e-mail ou nome de usuário; o identificador da sessão vira UUIDv7; e o requisito de dados de identificação muda (nome completo único, cargo/lotação como vínculos com vigência, situação do cadastro com histórico).
- `perfil-usuario`: os dados próprios passam a ter nome completo em vez de nome e sobrenome, e a atualização passa a exigir cargo informado, mantendo no máximo um cargo efetivo ativo.
- `dashboard-shell`: a identificação na barra superior passa a exibir o cargo vigente real em vez de texto fixo.

## Impact

- `prisma/schema.prisma` — reescrito por completo; `prisma/seed.ts` — reescrito a partir de `seed-usuario.md`.
- `auth.ts`, `auth.config.ts`, `types/next-auth.d.ts` — credencial, verificação de senha, montagem da sessão.
- `app/app/profile/*`, `components/profile/ProfileForm.tsx` — nome completo e campo de cargo.
- `app/app/change-password/actions.ts` — troca de bcrypt por Argon2id.
- `components/layout/Topbar.tsx` — cargo vigente no lugar do texto fixo.
- `package.json` — entra uma implementação de Argon2id; saem `bcryptjs` e `@types/bcryptjs`.
- Banco de desenvolvimento recriado do zero (sem dados a preservar).
