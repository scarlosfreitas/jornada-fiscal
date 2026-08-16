## 1. Toast global

- [x] 1.1 Montar `<Toaster position="bottom-center" toastOptions={{ className: "ga-toast-msg", duration: 4000 }} />` em `app/layout.tsx`
- [x] 1.2 Adicionar `.ga-toast-msg` a `app/gestor-alertas.css`, reaproveitando os tokens visuais de `.ga-toast` (cor, tipografia, raio) sem duplicar posicionamento

## 2. Página e formulário

- [x] 2.1 Criar `app/app/change-password/page.tsx` (server component) com `metadata.title` seguindo o padrão das demais telas
- [x] 2.2 Criar `components/change-password/ChangePasswordForm.tsx` (`"use client"`) com os três campos (`ga-field`/`ga-input`), usando classes do design system
- [x] 2.3 Toggle mostrar/ocultar por campo de senha com ícones `Eye`/`EyeOff` de `lucide-react`
- [x] 2.4 Hint inline (`ga-field-error`) sob o campo relevante quando aplicável (senha atual incorreta, confirmação não confere, nova senha curta/igual à atual), além do toast

## 3. Server Action

- [x] 3.1 Criar a Server Action (`"use server"`) que lê `userId` de `auth()` no servidor — nunca de um valor enviado pelo cliente
- [x] 3.2 Validar com `zod`: nova senha com mínimo de 8 caracteres, confirmação idêntica à nova senha
- [x] 3.3 Buscar o `Usuario` pelo `userId` e conferir a senha atual com `bcryptjs.compare` antes de qualquer gravação; rejeitar sem alterar nada se não conferir
- [x] 3.4 Rejeitar se a nova senha for igual à atual (comparar via `bcryptjs.compare` antes de decidir, nunca comparando texto puro com o hash)
- [x] 3.5 Gerar novo hash com `bcryptjs.hash` e `prisma.usuario.update` apenas o campo `password`
- [x] 3.6 Garantir que nenhuma senha, hash ou valor derivado apareça no retorno da action nem em `console.log`/logs
- [x] 3.7 Comentário no código sinalizando o encerramento automático de sessão pós-troca como melhoria futura não implementada

## 4. Verificação

- [x] 4.1 `npm run lint`
- [x] 4.2 Testar manualmente: senha atual errada (toast + hint, nada muda), nova senha curta (toast + hint), confirmação diferente (toast + hint), nova igual à atual (toast + hint), troca bem-sucedida (toast de sucesso, formulário limpo), login subsequente com a nova senha funciona e com a antiga falha, acesso sem sessão redireciona para a tela de entrada
