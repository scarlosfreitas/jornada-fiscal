## Why

O menu do usuário na barra superior já aponta para `/app/change-password` (change `create-admin-profile`, arquivada), mas a tela não existe. A pessoa usuária autenticada precisa de um jeito de trocar sua própria senha sem depender de outra pessoa, com a senha atual sempre conferida antes de qualquer alteração.

## What Changes

- Nova tela `/app/change-password`, protegida pelo shell da aplicação, com formulário de três campos (senha atual, nova senha, confirmação), toggle de mostrar/ocultar em cada campo de senha.
- Server Action que relê o id da pessoa usuária a partir da sessão (nunca do cliente), confere a senha atual com `bcryptjs.compare` antes de qualquer gravação, valida a nova senha com zod (tamanho mínimo, confirmação igual, diferente da atual) e grava o novo hash.
- Feedback exclusivamente por toast (`react-hot-toast`, já instalado mas ainda não montado no app) para sucesso e para cada motivo de rejeição; um aviso curto abaixo do campo é permitido além do toast, mas o toast é obrigatório.
- Ao suceder, o formulário é limpo. Encerrar a sessão automaticamente após a troca fica marcado como melhoria futura (comentário no código), não implementado agora.

## Capabilities

### New Capabilities

- `alterar-senha`: autoatendimento — a pessoa usuária troca sua própria senha, com a senha atual sempre verificada antes da troca.

### Modified Capabilities

(nenhuma — a spec `autenticacao` já exige que a senha nunca seja exposta em qualquer resposta; esta change consome esse requisito, não o altera)

## Impact

- Nova rota `app/app/change-password/page.tsx` (server component) + `components/change-password/ChangePasswordForm.tsx` (client component).
- Nova Server Action, ex. `app/app/change-password/actions.ts`.
- `react-hot-toast`: adiciona `<Toaster />` ao layout raiz (`app/layout.tsx`) — ainda não montado em nenhum lugar do app — e um estilo `ga-toast-msg` alinhado ao design system.
- `lib/db.ts` (Prisma) e `auth.ts` (sessão) consumidos, não alterados. Nenhuma alteração em `prisma/schema.prisma`.
