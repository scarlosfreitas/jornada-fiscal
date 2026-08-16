## Context

Ver proposal.md para a motivação. As fontes da verdade desta change são `references/domain/data-model-usuario.md` (estrutura das 15 tabelas) e `references/domain/seed-usuario.md` (carga inicial) — leia os dois antes de escrever qualquer código, e siga-os literalmente quanto a nomes de coluna, tipos, restrições e valores.

Estado atual relevante: `prisma/schema.prisma` tem 3 models (`Usuario`, `Perfil`, `UsuarioPerfil`) com ids `cuid()`; `auth.ts:38` usa `bcrypt.compare` e `auth.ts:45` monta `name` como `${nome} ${sobrenome}`; `app/app/profile/*` e `components/profile/ProfileForm.tsx` trabalham com os dois campos separados; `app/app/change-password/actions.ts` usa bcrypt em três pontos (`:53`, `:63`, `:72`); `components/layout/Topbar.tsx:179` tem `Coordenação` como texto fixo. Nenhuma tela administrativa de usuários existe — a superfície de escrita hoje se resume a seed, login (leitura), perfil e troca de senha.

## Goals / Non-Goals

**Goals:**
- Schema e seed fiéis aos dois documentos de referência.
- Telas existentes funcionando com o modelo novo, sem regressão de comportamento já especificado.

**Non-Goals:**
- Provisionamento de usuário via AD. O modelo precisa suportar o estado "sem cargo" (é assim que a pessoa entra pelo AD), mas o fluxo de criação por AD é change futura.
- Checagem de permissão por funcionalidade. `Funcionalidade`, `Func_Categoria` e `Perfil_Funcionalidade` são criadas e populadas, mas nenhuma tela as consome ainda — `session.user.perfis` já existe hoje e também não é lido por ninguém.
- Tela administrativa de usuários (`/app/configuracoes/usuarios` é só um link no menu).
- Preservar dados do banco atual.

## Decisions

**Nomes do banco em snake_case, models em PascalCase.** Os documentos usam `usr_id`, `perfil_nome`, `Usuario_Cargo`. Mapear com `@map`/`@@map` do Prisma, mantendo os models e campos em convenção TypeScript no código. Isso preserva a fidelidade ao documento no banco sem contaminar o código de aplicação com nomes fora do padrão.

**UUIDv7 gerado na aplicação.** `uuid@14` já está em `package.json` (hoje sem uso — o upload de avatar usa `randomUUID` de `node:crypto`). Usar `uuidv7()` dele em vez de adicionar dependência nova ou usar `uuid()` v4, porque o documento especifica v7 e a ordenação temporal do v7 é justamente o motivo de escolhê-lo.

**Vigência como parte da PK, não coluna comum.** Os documentos põem `vigencia_inicio` na PK composta das tabelas de vínculo. Isso permite o mesmo par (pessoa, cargo) se repetir ao longo do tempo — a pessoa pode voltar a um cargo que já teve. Modelar exatamente assim; `vigencia_fim` nulo significa vigente.

**Regra do cargo efetivo único fica na aplicação, não no banco.** Um índice parcial (`UNIQUE(usr_id) WHERE cargo_efetivo AND vigencia_fim IS NULL`) exigiria SQL manual na migration, já que o Prisma não expressa índice parcial no schema. A regra vive no código que grava cargo: antes de abrir um cargo efetivo novo, encerra o efetivo vigente (seta `vigencia_fim`). Trade-off aceito: uma escrita direta no banco pode violar a regra.

**Bootstrap circular resolvido pela ordem do seed.** `Usuario.origem_id` aponta para `Usuario_Origem`, enquanto `Usuario_Origem.criado_por` aponta de volta para `Usuario`. O `seed-usuario.md` resolve mandando começar por `Usuario` com as restrições suspensas e reativá-las ao final; o admin (`019c0b11-a400-7000-8000-000000000000`) se auto-referencia em `criado_por`/`atualizado_por`. Todos os demais registros usam o id do admin nessas colunas.

**Hashes do seed são literais, não gerados.** O `seed-usuario.md` já traz os hashes Argon2id prontos. Copiá-los como estão — não chamar `hash()` no seed, que produziria um valor diferente e quebraria a senha combinada.

**Argon2id via `@node-rs/argon2`.** Implementação nativa, sem dependência de compilação em runtime, e a API (`hash`/`verify`) mapeia direto no que os três pontos de bcrypt fazem hoje. Alternativa considerada: `argon2` (node-gyp), descartada pelo custo de build.

**Identificador de login resolvido no servidor.** O formulário passa a ter um campo único de identificador. O `authorize` decide se é e-mail ou nome de usuário — a heurística simples (contém `@`) é suficiente e evita duas consultas; se não contiver `@`, busca por `usr_username`. Não expor qual dos dois falhou: a mensagem de erro continua indistinguível, como a spec já exige.

**Cargo vigente calculado na montagem da sessão.** A regra (comissionado vigente mais recente → senão efetivo vigente) é aplicada uma vez no `authorize`/`jwt` e o rótulo resultante vai para o token, em vez de consultar o banco a cada render da topbar. Consequência: uma troca de cargo só reflete na barra superior após `updateSession()` — a Server Action de perfil já chama isso hoje (`app/app/profile/actions.ts:149-155`), então basta incluir o cargo no payload.

**Cargo no formulário de perfil.** A regra "qualquer atualização exige cargo informado" vale também para o autoatendimento, então `ProfileForm` ganha um campo de cargo obrigatório, alimentado pela tabela `Cargo`. Isso difere deliberadamente do perfil de acesso, que a spec `perfil-usuario` mantém fora da tela: cargo é dado funcional que a própria pessoa declara enquanto não há integração com o diretório corporativo; perfil de acesso é concessão de privilégio e continua sendo operação administrativa.

## Risks / Trade-offs

- [Permitir que a pessoa escolha o próprio cargo é uma superfície de auto-atribuição] → aceito por decisão de produto e porque hoje o cargo é apenas informativo (alimenta o rótulo da barra superior); nenhuma permissão deriva dele. Se cargo passar a conceder acesso, essa decisão precisa ser revista — registrar isso em comentário no código, ao lado do comentário que já explica por que o perfil de acesso não é editável ali.
- [Todas as senhas atuais deixam de funcionar] → esperado e aceito: o banco é recriado do zero e não há dados de produção. Não há caminho de migração de bcrypt para Argon2id sem a senha em texto puro.
- [A regra de cargo único vigente não é garantida pelo banco] → mitigado por concentrar toda escrita de cargo em um único ponto no código; uma migration com índice parcial pode ser adicionada depois sem alterar o schema Prisma.
- [O seed depende de suspender e reativar restrições NOT NULL] → se o processo falhar no meio, o banco fica com restrições afrouxadas. Como é ambiente de desenvolvimento e o comando recomendado é `prisma migrate reset` (que recria tudo), o risco é de retrabalho, não de corrupção.
