## Why

O menu do usuário na barra superior já aponta para `/app/profile`, mas a tela não existe (change `create-admin-profile`, arquivada). A pessoa usuária autenticada precisa de um lugar para ver e atualizar seus próprios dados cadastrais — sem poder alterar o próprio perfil de acesso, o que é uma operação administrativa distinta.

## What Changes

- Nova tela `/app/profile`, protegida pelo shell da aplicação, que carrega os dados da pessoa autenticada (nome, sobrenome, e-mail, telefone, imagem) a partir da sessão e do Prisma, sem nunca expor a senha.
- Formulário client component + Server Action de atualização que: relê o id da sessão no servidor (nunca confia em id vindo do cliente), valida com zod, rejeita e-mail já usado por outra pessoa, atualiza nome/sobrenome/e-mail/telefone/imagem, e **ignora qualquer perfil de acesso enviado** — perfil de acesso só muda pela tela administrativa de usuários (fora do escopo desta change).
- Upload simples de imagem de perfil: a nova imagem é salva em disco (`public/uploads/avatars`) e o caminho é gravado em `Usuario.image`; sem redimensionamento/CDN por enquanto.
- Após salvar com sucesso, a tela mostra confirmação e os dados atualizados refletem imediatamente, inclusive nome/iniciais na barra superior.

## Capabilities

### New Capabilities

- `perfil-usuario`: autoatendimento — a pessoa usuária visualiza e atualiza seus próprios dados cadastrais (exceto senha e perfil de acesso).

### Modified Capabilities

(nenhuma)

## Impact

- Nova rota `app/app/profile/page.tsx` (server component) + `components/profile/ProfileForm.tsx` (client component).
- Nova Server Action, ex. `app/app/profile/actions.ts`.
- `lib/db.ts` (Prisma) e `auth.ts` (sessão) consumidos, não alterados.
- Novo diretório `public/uploads/avatars/` para as imagens enviadas.
- Nenhuma alteração em `prisma/schema.prisma` — os campos necessários (`nome`, `sobrenome`, `email`, `telefone`, `image`) já existem em `Usuario`.
