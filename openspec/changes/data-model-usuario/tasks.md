## 1. Dependências

- [ ] 1.1 Adicionar `@node-rs/argon2` ao `package.json`
- [ ] 1.2 Remover `bcryptjs` e `@types/bcryptjs` (só depois que nenhum arquivo os importe: `auth.ts`, `app/app/change-password/actions.ts`, `prisma/seed.ts`)

## 2. Modelo de dados

- [ ] 2.1 Reescrever `prisma/schema.prisma` com as 15 tabelas de `references/domain/data-model-usuario.md`, usando `@map`/`@@map` para os nomes snake_case
- [ ] 2.2 Aplicar em todas as tabelas o bloco de auditoria (`criado_por`, `atualizado_por`, `criado_em`, `atualizado_em`, `deletado_em`)
- [ ] 2.3 Nas tabelas de vínculo (`Usuario_Cargo`, `Usuario_Lotacao`, `Usuario_Perfil`, `Usuario_Situacao`, `Perfil_Funcionalidade`), incluir `vigencia_inicio` na PK composta e `vigencia_fim` nullable
- [ ] 2.4 Modelar a auto-relação de `Setor` (`setor_pai`) e as FKs auto-referentes de auditoria para `Usuario`
- [ ] 2.5 Gerar a migration e conferir que `prisma migrate reset` cria o banco sem erro

## 3. Seed

- [ ] 3.1 Reescrever `prisma/seed.ts` a partir de `references/domain/seed-usuario.md`, com os ids fixos do documento (não gerados) e os hashes Argon2id literais (não re-hasheados)
- [ ] 3.2 Respeitar a ordem de inserção do documento, começando por `Usuario` com as restrições suspensas, e reativá-las ao final
- [ ] 3.3 Preencher `criado_por`/`atualizado_por` com o id do admin em todos os registros; o admin se auto-referencia

## 4. Autenticação

- [ ] 4.1 Em `auth.ts`, trocar o `credentialsSchema` por um identificador único que aceite e-mail ou nome de usuário, resolvendo qual foi informado no servidor
- [ ] 4.2 Substituir `bcrypt.compare` (`auth.ts:38`) pela verificação Argon2id
- [ ] 4.3 Montar `name` a partir do nome completo, no lugar da concatenação `${nome} ${sobrenome}` (`auth.ts:45`)
- [ ] 4.4 Calcular o cargo vigente (comissionado vigente mais recente; senão efetivo vigente) e incluí-lo no token/sessão
- [ ] 4.5 Ampliar `types/next-auth.d.ts` com o cargo na sessão
- [ ] 4.6 Ajustar a tela de entrada (`components/auth/LoginForm.tsx`) para o campo de identificador único

## 5. Telas existentes

- [ ] 5.1 `components/layout/Topbar.tsx:179` — substituir o texto fixo "Coordenação" pelo cargo vigente da sessão, omitindo o rótulo quando não houver cargo
- [ ] 5.2 `/app/profile` — colapsar `nome`/`sobrenome` em um campo único de nome completo (`page.tsx:25-26`, `actions.ts:26-27,46,144,151`, `ProfileForm.tsx:10-22,104-141`)
- [ ] 5.3 `/app/profile` — adicionar campo de cargo obrigatório, alimentado pela tabela `Cargo`
- [ ] 5.4 Na Server Action de perfil, ao gravar cargo efetivo, encerrar o efetivo vigente anterior antes de abrir o novo
- [ ] 5.5 Incluir o cargo no payload de `updateSession()` para a barra superior refletir a mudança
- [ ] 5.6 Comentar no código por que o cargo é editável no autoatendimento e o perfil de acesso não (ver design.md)
- [ ] 5.7 `app/app/change-password/actions.ts` — trocar as três chamadas bcrypt (`:53`, `:63`, `:72`) pelo equivalente Argon2id

## 6. Verificação

- [ ] 6.1 `npx prisma migrate reset` recria o banco e roda o seed sem erro
- [ ] 6.2 Conferir no banco: 9 usuários, `deletado_em` nulo em tudo, 2 linhas por usuário em `Usuario_Situacao` (Criado encerrado, Ativo vigente), 3 vínculos em `Usuario_Perfil`, 9 em `Usuario_Cargo`, 9 em `Usuario_Lotacao`
- [ ] 6.3 `npm run lint` e `npm run build`
- [ ] 6.4 Login com `admin` (nome de usuário) e com `scarlosfreitas@gmail.com` (e-mail) — ambos funcionam com a mesma senha
- [ ] 6.5 Topbar: `gerente` exibe "Gerente do CEPAF" (comissionado); `auditor` exibe "Auditor da Receita" (efetivo)
- [ ] 6.6 `/app/profile`: campo único de nome pré-preenchido; salvar sem cargo é recusado; trocar o cargo efetivo encerra o anterior em vez de criar um segundo vigente; nome e cargo refletem na barra superior
- [ ] 6.7 `/app/change-password`: troca funciona, novo hash é Argon2id, login com a senha antiga falha
