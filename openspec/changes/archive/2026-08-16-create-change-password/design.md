## Context

`app/app/layout.tsx` já protege tudo sob `/app` (ver `openspec/specs/autenticacao/spec.md` — "Proteção das áreas privadas"); a nova página herda essa proteção por estar sob `app/app/`. `lib/routes.ts` já tem `ROUTES.alterarSenha = "/app/change-password"` e a Topbar já linka para lá (`create-admin-profile`). `auth.ts` usa `bcrypt.compare` para o login — o mesmo padrão se aplica aqui para conferir a senha atual. `react-hot-toast` está no `package.json` mas nenhum `<Toaster />` está montado em nenhum layout do app ainda — esta é a primeira change a usá-lo de fato.

## Goals / Non-Goals

**Goals:**
- Tela de autoatendimento em `/app/change-password` para trocar a própria senha, com a senha atual sempre verificada primeiro.
- Feedback padronizado por toast, reutilizável por outras telas futuras.

**Non-Goals:**
- Encerrar a sessão automaticamente após a troca — fica como comentário de melhoria futura no código, sem implementar.
- Política de senha além de tamanho mínimo (sem exigir maiúscula/número/símbolo) — não pedido, e a spec `autenticacao` não define regra de robustez além da conferência de hash.
- "Esqueci minha senha" (fluxo sem sessão) — fora de escopo, esta tela exige sessão ativa e senha atual conhecida.

## Decisions

**Server Action + Server Component, mesmo padrão de `update-user-profile`.** `app/app/change-password/page.tsx` é um Server Component simples (só monta o shell da tela; não precisa carregar dado nenhum do Prisma, já que os campos são todos de entrada). `ChangePasswordForm` é client component. A troca em si é uma Server Action (`"use server"`), sem API route.

**Identidade sempre da sessão, nunca do formulário** — mesmo racional de `update-user-profile`: a action começa lendo `session.user.id` e usa esse id em todo `prisma.usuario.findUnique`/`update`.

**Ordem de verificação: sessão → validação de forma (zod) → senha atual (bcrypt) → nova ≠ atual → grava.** A comparação de senha atual só acontece depois que o formato já é válido (evita bater no bcrypt, que é deliberadamente lento, com entradas obviamente malformadas); mas nada é gravado antes de bcrypt confirmar a senha atual.

**Toggle mostrar/ocultar por campo, estado local no client.** Cada campo de senha tem seu próprio `useState<boolean>` de visibilidade e alterna `type="password"`/`type="text"`, com `Eye`/`EyeOff` de `lucide-react` como botão dentro do próprio `ga-input` (mesmo wrapper, ícone posicionado à direita — padrão consistente com outros inputs com ícone do design system, ex. a busca da Topbar).

**Toast: montar `<Toaster />` no layout raiz (`app/layout.tsx`), estilizado para o design system.** Colocado no layout raiz (não no `app/app/layout.tsx`) porque toast é infraestrutura de feedback global, não específica da área autenticada — outras telas fora de `/app` (ex. a tela de entrada) podem precisar no futuro. Estilo: `toastOptions={{ className: "ga-toast-msg", duration: 4000 }}`. Novo seletor `.ga-toast-msg` em `app/gestor-alertas.css`, reaproveitando os tokens de cor/tipografia de `.ga-toast` (fundo `var(--ga-ink)`, texto `var(--ga-white)`, borda `var(--ga-radius-lg)`) mas **sem** as regras de posicionamento (`position/left/transform`) do `.ga-toast` original — essas ficam a cargo do próprio `<Toaster position="bottom-center">`, que já anima a entrada/saída com seu próprio `transform` inline; reaplicar posicionamento entraria em conflito.

**Toast + hint inline juntos, não um no lugar do outro.** Cada rejeição (senha atual errada, validação, mismatch) dispara `toast.error(mensagem)` e, quando faz sentido apontar um campo específico (ex. confirmação diferente), também seta um estado de erro local que mostra o hint da spec do design (`ga-field-error`) sob aquele campo — como já é o padrão em `LoginForm.tsx`.

## Risks / Trade-offs

- [Padronizar toasts pela primeira vez nesta change decide o estilo/posição para todo o app] → aceito conscientemente: usar `react-hot-toast` (já instalado) em vez de introduzir outra lib, e documentar a decisão aqui para telas futuras seguirem o mesmo padrão.
- [`bcrypt.compare` roda mesmo quando a validação de forma falha antes seria mais barato pular tudo] → mitigado pela ordem de verificação acima (zod antes de bcrypt); não é um risco de segurança, só de custo de CPU evitável.
