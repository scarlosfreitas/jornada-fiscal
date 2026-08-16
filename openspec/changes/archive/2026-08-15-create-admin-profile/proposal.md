## Why

O menu do usuário na barra superior já abre e fecha (clique fora, `Esc`), mas seus itens são um placeholder ("Meu perfil" / "Sair" sem link real) e a identificação exibida ("Ana Ribeiro" / "AR") é um mock fixo, não a pessoa autenticada. Antes de existirem as telas de perfil e troca de senha, o menu precisa expor os três acessos esperados pela pessoa usuária administrativa, apontar para as rotas certas e refletir a sessão real — incluindo o encerramento de sessão pelo próprio menu.

## What Changes

- O menu do usuário passa a ter três itens, cada um com ícone: **Perfil** (`/app/profile`), **Alterar senha** (`/app/change-password`) e **Sair** (encerra a sessão via `signOut` do Auth.js e redireciona para a tela de entrada).
- Selecionar qualquer item do menu fecha o menu, além dos fechamentos já existentes (clique fora, `Esc`).
- As iniciais e o nome exibidos na barra superior passam a vir da sessão Auth.js da pessoa autenticada, substituindo o mock "Ana Ribeiro" / "AR".
- `ROUTES` (`lib/routes.ts`) ganha as entradas `perfil` e `alterarSenha`; as rotas `/app/profile` e `/app/change-password` ainda não têm página própria (fora do escopo desta change).

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `dashboard-shell`: o requisito "Notificações e identificação do usuário na barra superior" passa a exigir que a identificação venha da sessão autenticada e que o menu do usuário ofereça os acessos a Perfil, Alterar senha e Sair, fechando-se ao selecionar qualquer um deles.

## Impact

- `components/layout/Topbar.tsx`: itens do menu, ícones, dados de sessão, fechamento ao selecionar.
- `app/app/layout.tsx`: passa a repassar dados da sessão (já obtida via `auth()`) para o `Topbar`.
- `lib/routes.ts`: novas entradas de rota para perfil e alteração de senha.
- Nenhuma alteração em `auth.ts`/`auth.config.ts` — `signOut` do `next-auth/react` já cobre o encerramento de sessão especificado em `autenticacao`.
