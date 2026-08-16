## Context

`app/app/layout.tsx` já chama `auth()` e protege tudo sob `/app` (ver `openspec/specs/autenticacao/spec.md` — "Proteção das áreas privadas"); a nova página herda essa proteção automaticamente por estar sob `app/app/`. `lib/routes.ts` já tem `ROUTES.perfil = "/app/profile"` (de `create-admin-profile`) e a Topbar já linka para lá. `prisma/schema.prisma` já tem todos os campos necessários em `Usuario` (`nome`, `sobrenome`, `email`, `telefone`, `image`) — nenhuma migração é necessária. Não há mock de design (`references/design/*.html`) para uma tela de "meu perfil"; os 10 protótipos cobrem outras telas (o mais próximo, `ListaUsuarios.html`, é o modal administrativo de atribuição de perfis de acesso, não um formulário de autoatendimento). O layout do formulário abaixo é composto a partir dos componentes `ga-*` já existentes (`ga-field`, `ga-input`, `ga-avatar`, `ga-btn`), sem inventar classes novas.

Não existe rota de upload nem storage de arquivos no projeto ainda. `@aws-sdk/client-s3` está instalado, mas é para a plataforma de dados externa (ver CLAUDE.md, "Fora do escopo") — não deve ser usado para servir imagens de perfil da aplicação.

## Goals / Non-Goals

**Goals:**
- Tela de autoatendimento em `/app/profile` para ver/editar os próprios dados cadastrais.
- Upload de imagem de perfil simples, sem infraestrutura nova.
- Impedir, em duas camadas (UI e Server Action), que a pessoa altere seu próprio perfil de acesso por essa tela.

**Non-Goals:**
- Alterar senha (tela separada `/app/change-password`, fora desta change).
- Gestão de perfil de acesso de qualquer pessoa (tela administrativa de usuários, fora desta change).
- Redimensionamento, recorte ou CDN para a imagem — armazenamento local simples.
- Cargo/lotação (existem no schema, mas não fazem parte do pedido; ficam de fora do formulário).

## Decisions

**Server Action + Server Component, sem API route.** `app/app/profile/page.tsx` é um Server Component que chama `auth()` e `prisma.usuario.findUnique` para montar os dados iniciais, e passa como props para `ProfileForm` (client component, `"use client"`). Salvar chama uma Server Action (`"use server"`) em vez de um endpoint route handler — mais simples para um form único, sem necessidade de um contrato HTTP reutilizável por outro cliente.

**Identidade sempre da sessão, nunca do formulário.** A Server Action começa com `const session = await auth(); const userId = session?.user?.id;` e usa esse `userId` em todo `prisma.usuario.update`. O formulário não envia (nem a action lê) nenhum campo de id — elimina a classe de bug "IDOR" por construção, não por validação a mais.

**Perfil de acesso: omitido da UI, ignorado na action.** O formulário não renderiza nenhum campo de perfil de acesso (nem leitura, nem seleção) — a tela simplesmente não tem esse controle, o que é mais simples e mais seguro do que renderizar desabilitado (não há valor para vazar/adulterar via devtools). O `zod` schema da action valida apenas os campos permitidos (`nome`, `sobrenome`, `email`, `telefone`, `image`); qualquer chave adicional em um `FormData` forjado é descartada por não fazer parte do schema. Comentário no código (`// Perfil de acesso não é editável aqui — só pela tela administrativa de usuários`) marca a decisão pra quem for mexer depois.

**Upload de imagem: `FormData` + escrita em `public/uploads/avatars/`, caminho salvo em `Usuario.image`.** A Server Action recebe o arquivo como parte do mesmo `FormData` do restante do formulário (um único submit). Valida tipo (`image/jpeg`, `image/png`, `image/webp`) e tamanho (máx. 2 MB) com `zod`. Nome do arquivo gerado como `${userId}-${Date.now()}.${ext}` para evitar colisão e para que uma nova imagem naturalmente substitua a referência antiga (o arquivo antigo não é removido do disco nesta versão — ver Riscos). Servido como asset estático do Next (`/uploads/avatars/...`), sem rota de leitura própria.

**Revalidação em vez de reload manual.** Depois de um update bem-sucedido, a action chama `revalidatePath("/app/profile")` e `revalidatePath("/app", "layout")` — o segundo recarrega os dados do layout (que passa `userName` para a `Topbar`), fazendo nome/iniciais na barra superior refletirem a mudança sem lógica extra no client.

## Risks / Trade-offs

- [Arquivo de avatar antigo não é removido ao trocar de imagem, acumulando lixo em `public/uploads/avatars/`] → aceito para esta primeira versão ("keep upload handling simple for now" no pedido original); limpeza pode ser um job futuro se o volume incomodar.
- [Salvar uploads no filesystem local não sobrevive a deploys sem disco persistente compartilhado] → aceito por ora: é consistente com o estágio atual do projeto (sem storage de objetos próprio da aplicação); migrar para object storage é um problema de infraestrutura de deploy, não desta change.
- [Corrida entre duas abas trocando o e-mail ao mesmo tempo pode passar da checagem de unicidade antes do `update`] → mitigado pela constraint `@unique` do Prisma no schema: a segunda gravação falha no banco mesmo que passe na checagem em memória; a action captura esse erro e devolve a mesma mensagem de "e-mail já em uso".
