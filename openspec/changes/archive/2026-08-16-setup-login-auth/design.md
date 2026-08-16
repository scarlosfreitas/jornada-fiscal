## Context

Ver `proposal.md` — Why. O que condiciona o desenho:

- **Next.js 16 renomeou `middleware.ts` para `proxy.ts`.** Confirmado em `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`: *"the `middleware` file convention is deprecated and has been renamed to `proxy`"*. O arquivo exporta uma função `proxy` (default ou nomeada) e um `config.matcher` opcional. O mesmo doc alerta que, **sem matcher, o proxy roda em toda requisição** — inclusive `_next/static`, `_next/image` e `public/` — e que isso faz lógica de auth bloquear CSS, JS e imagens. Quase todo material sobre Auth.js v5 disponível hoje ainda instrui `middleware.ts`.
- `next-auth@5.0.0-beta.32` instalado, com peer `next: ^14 || ^15 || ^16` declarado. `bcryptjs`, `zod` e `@prisma/client` também já estão. Faltam `lucide-react` e `tsx`.
- Não existe `prisma/`. O `DATABASE_URL` aponta para `postgresql://…@db:5432/…` desde a change `postgres-compose`, mas o banco nunca foi verificado em execução.
- O domínio (`references/domain/regras-negocio.md`, seção Perfis; `docs/PRD.md` linhas 27, 34 e 89) estabelece que a autenticação é por **Active Directory**, que **cada usuário pode ter várias perfis**, que novos perfis são cadastráveis, e que **cargo e lotação são dados espelhados do AD**. O Administrador é a exceção: senha própria, fora do AD.
- Definição do usuário para esta fase: **todos com senha administrada pela aplicação**; o AD entra depois, fornecendo cargo e lotação. Até lá, esses dois campos são preenchidos no cadastro.
- O shell da aplicação vive em `app/(dashboard)/layout.tsx` e o painel em `app/(dashboard)/dashboard/page.tsx`. `app/page.tsx` ainda é o boilerplate do `create-next-app`.

## Goals / Non-Goals

**Goals:**

- Fechar o acesso à aplicação com um mecanismo que não precise ser refeito quando o AD entrar.
- Modelar usuários e perfis fiéis ao domínio desde a primeira migration, evitando migration de correção previsível.
- Rotas com fonte única, para que a mudança de prefixo seja a última que exige varredura de arquivos.

**Non-Goals:**

- Integrar com o AD.
- Telas de cadastro de usuários e de perfis.
- Autorização fina por funcionalidade — a sessão carrega os perfis, mas nenhuma tela é restringida por perfil nesta change.
- Recuperação de senha, bloqueio de usuário, certificado A3.

## Decisions

### 1. `Perfil` como tabela, não enum

```prisma
model Usuario {
  id             String   @id @default(cuid())
  nome           String
  sobrenome      String
  email          String   @unique
  password       String
  telefone       String?
  image          String?
  cargo          String?
  lotacao        String?
  sq_situacao    Int      @default(1)
  dt_criacao     DateTime @default(now())
  dt_atualizacao DateTime @updatedAt
  perfis         UsuarioPerfil[]
}

model Perfil {
  id        String @id @default(cuid())
  nome      String @unique
  descricao String?
  usuarios  UsuarioPerfil[]
}

model UsuarioPerfil {
  usuarioId String
  perfilId  String
  usuario   Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  perfil    Perfil  @relation(fields: [perfilId], references: [id], onDelete: Cascade)
  @@id([usuarioId, perfilId])
}
```

Um `enum Perfil` com um valor por usuário — como no pedido original — não comporta nada do que o domínio exige: *"cada usuário pode ter várias perfis"* e *"novos podem ser cadastrados e funcionalidades incluídas neles"*. Perfil como linha resolve as duas coisas; a junção explícita (em vez de `@relation` implícita) deixa espaço para atributos futuros na atribuição, como quem atribuiu e quando.

*Alternativa considerada*: array de enum, suportado pelo Postgres. Rejeitada — resolve a multiplicidade mas não o cadastro em runtime, que continuaria exigindo migration.

### 2. `password` obrigatório agora, opcional quando o AD entrar

Na fase 1 todos autenticam pela aplicação, então a coluna obrigatória expressa um invariante verdadeiro e o banco o garante. Quando só o Administrador ficar fora do AD, torná-la anulável é uma migration trivial e não bloqueante em Postgres.

Não é introduzido campo de "origem da autenticação" agora: enquanto só existe um caminho, seria uma coluna com valor constante. Ela entra junto com a integração, que é quem sabe o que precisa distinguir.

### 3. `cargo` e `lotacao` no schema desde já

São dados que o AD vai espelhar, mas que a operação precisa hoje. Nascem opcionais e preenchidos no cadastro; quando o AD entrar, passam a ser sobrescritos por ele. Deixá-los de fora agora obrigaria a uma migration e a um retrabalho de formulário previsíveis.

### 4. Split de configuração do Auth.js

- `auth.config.ts` — leve: `pages: { signIn: "/" }`, `session: { strategy: "jwt" }`, callback `authorized`, `providers: []`.
- `auth.ts` — `NextAuth({ ...authConfig, providers: [Credentials({ authorize })] })`, exportando `{ handlers, auth, signIn, signOut }`.

O `proxy.ts` roda no edge e importa apenas `auth.config.ts`. Sem essa separação, o proxy arrastaria Prisma e bcrypt para um runtime onde não funcionam.

`session: { strategy: "jwt" }` não é preferência: sessão em banco **não funciona** com o provider Credentials. Por isso também não há adapter Prisma nesta change, apesar de `@auth/prisma-adapter` estar instalado — ele entra quando houver provider que o exija.

### 5. `authorize()` — ordem das operações e mensagens de erro

1. `zod` valida forma de e-mail e senha não vazia — **antes** de qualquer query. Entrada malformada não chega ao banco.
2. Busca por e-mail.
3. `bcryptjs.compare` contra o hash.
4. Retorna o usuário **sem o campo `password`**, com a lista de nomes de perfis. Falha retorna `null`.

Usuário inexistente e senha errada produzem a **mesma** resposta: distinguir os dois casos entrega ao atacante um oráculo de e-mails válidos. Por isso a tela também exibe uma única mensagem genérica.

### 6. `proxy.ts` com matcher restrito

```ts
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export const { auth: proxy } = NextAuth(authConfig);

export const config = { matcher: ["/app/:path*"] };
```

O matcher em `/app/:path*` responde diretamente ao alerta do doc: `_next/*`, `public/` e `/api/auth/*` ficam fora por construção, sem precisar da regex de exclusão negativa que se vê na maioria dos exemplos. Menos superfície e mais legível.

### 7. Segunda camada dentro do layout

`app/app/layout.tsx` chama `auth()` e redireciona para `/` quando não há sessão.

Guarda só no proxy é contornável, e o proxy pode ser desabilitado por configuração ou não cobrir um caminho novo que alguém acrescente fora do matcher. A verificação no layout é o ponto por onde toda tela da aplicação obrigatoriamente passa.

### 8. `/app` como índice e o destaque da navegação

Com o painel em `/app`, a detecção de item ativo da `Sidebar` via `usePathname()` precisa de comparação exata para o índice — um `startsWith("/app")` deixaria "Painel" aceso em todas as telas. Regra: item pai casa por prefixo, item de índice casa por igualdade.

### 9. `lib/routes.ts` como fonte única

Hoje as rotas estão em `components/layout/nav-data.ts` **e** espalhadas em três `<Link>` que já divergem entre si e da navegação:

| Arquivo | href atual | correto |
|---|---|---|
| `components/dashboard/PainelOperacional.tsx:72` | `/regras` | `/app/regras/regras-de-alerta` |
| `components/dashboard/UltimosAlertasTable.tsx:12` | `/alertas-gerados` | `/app/regras/alertas-gerados` |
| `components/dashboard/MonitoramentosAtivosTable.tsx:12` | `/monitoramento` | `/app/monitoramento` |

Um módulo `ROUTES` com `APP_BASE = "/app"` corrige a divergência e torna a próxima mudança de prefixo uma edição de uma linha.

### 10. Tela de login com o design system

Não existe design de sign-in: `references/design/` tem dez páginas e nenhuma delas é de login. A tela é montada com `.ga-card`, os campos de formulário e `.ga-btn-primary`, usando `DesignSystem.html` como catálogo de componentes, e o tratamento de erro com os tokens `--ga-danger*`. Nada de layout inventado — quando o design chegar, o que muda é a moldura, não o comportamento.

### 11. `lucide-react` como sistema único de ícones

Reverte a decisão 4 de `dashboard-shell`, que optara por SVG inline por o protótipo não usar lucide. A troca é deliberada e vale pela consistência de ter um sistema só.

**Ressalva a resolver na execução**: os paths do protótipo são próprios e alguns não têm equivalente exato em lucide — o ícone de Painel, por exemplo, é um arranjo específico de quatro retângulos. Onde não houver correspondência fiel, a decisão é caso a caso entre aceitar o ícone mais próximo e manter aquele SVG inline; a comparação visual precisa ser mostrada antes de fixar.

## Risks / Trade-offs

- **Migration exige banco de pé, e o Postgres nunca foi verificado em execução** → as tarefas 6.1 a 6.4 de `postgres-compose` continuam abertas; a verificação na máquina hospedeira é pré-requisito da tarefa 1, não um detalhe.
- **Credenciais do administrador no seed** → vêm de variáveis de ambiente, com fallback apenas para desenvolvimento. Nada de senha real em arquivo versionado, e o `.env.example` traz apenas placeholder.
- **A migração de ícones toca sidebar e painel, telas já validadas** → grupo de tarefas separado e último, para poder ser revertido sem desfazer a autenticação.
- **Especificações pendentes citando `/dashboard`** → o delta de `page-dashboard` afirma "Painel operacional na rota /dashboard". A tarefa 0 corrige o texto. Se as changes forem arquivadas antes desta ser aplicada, o ajuste vira `MODIFIED Requirements` sobre `dashboard-panel`.
- **JWT não é revogável do lado do servidor** → encerrar sessão apaga o cookie, mas um token vazado vale até expirar. Aceitável nesta fase; quando houver bloqueio de usuário (regra do domínio), será preciso verificar situação a cada requisição ou reduzir a validade do token.

## Migration Plan

Não há usuários nem dados. Sequência: subir o banco → `prisma migrate dev` → `prisma db seed` → autenticar com o administrador criado.

Rollback: reverter os arquivos e descartar o volume do Postgres. Nada se perde.

## Open Questions

Nenhuma.
