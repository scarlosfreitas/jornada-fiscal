## 1. Dependências

- [x] 1.1 Adicionar `@node-rs/argon2` ao `package.json`
- [x] 1.2 Remover `bcryptjs` e `@types/bcryptjs` (só depois que nenhum arquivo os importe: `auth.ts`, `app/app/change-password/actions.ts`, `prisma/seed.ts`)

## 2. Modelo de dados

- [x] 2.1 Reescrever `prisma/schema.prisma` com as 15 tabelas de `references/domain/data-model-usuario.md`, usando `@map`/`@@map` para os nomes snake_case
- [x] 2.2 Aplicar em todas as tabelas o bloco de auditoria (`criado_por`, `atualizado_por`, `criado_em`, `atualizado_em`, `deletado_em`)
- [x] 2.3 Nas tabelas de vínculo (`Usuario_Cargo`, `Usuario_Lotacao`, `Usuario_Perfil`, `Usuario_Situacao`, `Perfil_Funcionalidade`), incluir `vigencia_inicio` na PK composta e `vigencia_fim` nullable
- [x] 2.4 Modelar a auto-relação de `Setor` (`setor_pai`) e as FKs auto-referentes de auditoria para `Usuario`
- [x] 2.5 Gerar a migration e conferir que `prisma migrate reset` cria o banco sem erro

## 3. Seed

- [x] 3.1 Reescrever `prisma/seed.ts` a partir de `references/domain/seed-usuario.md`, com os ids fixos do documento (não gerados) e os hashes Argon2id literais (não re-hasheados)
- [x] 3.2 Respeitar a ordem de inserção do documento, começando por `Usuario` com as restrições suspensas, e reativá-las ao final
- [x] 3.3 Preencher `criado_por`/`atualizado_por` com o id do admin em todos os registros; o admin se auto-referencia

## 4. Autenticação

- [x] 4.1 Em `auth.ts`, trocar o `credentialsSchema` por um identificador único que aceite e-mail ou nome de usuário, resolvendo qual foi informado no servidor
- [x] 4.2 Substituir `bcrypt.compare` (`auth.ts:38`) pela verificação Argon2id
- [x] 4.3 Montar `name` a partir do nome completo, no lugar da concatenação `${nome} ${sobrenome}` (`auth.ts:45`)
- [x] 4.4 Calcular o cargo vigente (comissionado vigente mais recente; senão efetivo vigente) e incluí-lo no token/sessão
- [x] 4.5 Ampliar `types/next-auth.d.ts` com o cargo na sessão
- [x] 4.6 Ajustar a tela de entrada (`components/auth/LoginForm.tsx`) para o campo de identificador único

## 5. Telas existentes

- [x] 5.1 `components/layout/Topbar.tsx:179` — substituir o texto fixo "Coordenação" pelo cargo vigente da sessão, omitindo o rótulo quando não houver cargo
- [x] 5.2 `/app/profile` — colapsar `nome`/`sobrenome` em um campo único de nome completo (`page.tsx:25-26`, `actions.ts:26-27,46,144,151`, `ProfileForm.tsx:10-22,104-141`)
- [x] 5.3 `/app/profile` — adicionar campo de cargo obrigatório, alimentado pela tabela `Cargo`
- [x] 5.4 Na Server Action de perfil, ao gravar cargo efetivo, encerrar o efetivo vigente anterior antes de abrir o novo
- [x] 5.5 Incluir o cargo no payload de `updateSession()` para a barra superior refletir a mudança
- [x] 5.6 Comentar no código por que o cargo é editável no autoatendimento e o perfil de acesso não (ver design.md)
- [x] 5.7 `app/app/change-password/actions.ts` — trocar as três chamadas bcrypt (`:53`, `:63`, `:72`) pelo equivalente Argon2id

## 6. Verificação

- [x] 6.1 `npx prisma migrate reset` recria o banco e roda o seed sem erro
- [x] 6.2 Conferir no banco: 9 usuários, `deletado_em` nulo em tudo, 2 linhas por usuário em `Usuario_Situacao` (Criado encerrado, Ativo vigente), 3 vínculos em `Usuario_Perfil`, 9 em `Usuario_Cargo`, 9 em `Usuario_Lotacao`
- [x] 6.3 `npm run lint` e `npm run build`
- [x] 6.4 Login com `admin` (nome de usuário) e com `scarlosfreitas@gmail.com` (e-mail) — ambos funcionam com a mesma senha
- [x] 6.5 Topbar: `gerente` exibe "Gerente do CEPAF" (comissionado); `auditor` exibe "Auditor da Receita" (efetivo)
- [x] 6.6 `/app/profile`: campo único de nome pré-preenchido; salvar sem cargo é recusado; trocar o cargo efetivo encerra o anterior em vez de criar um segundo vigente; nome e cargo refletem na barra superior
- [x] 6.7 `/app/change-password`: troca funciona, novo hash é Argon2id, login com a senha antiga falha
