## 1. Rotas

- [ ] 1.1 Adicionar `perfil` (`/app/profile`) e `alterarSenha` (`/app/change-password`) a `ROUTES` em `lib/routes.ts`

## 2. Sessão no layout

- [ ] 2.1 Em `app/app/layout.tsx`, repassar `session.user.name` (já obtido via `auth()`) como prop para `Topbar`

## 3. Menu do usuário na Topbar

- [ ] 3.1 Em `components/layout/Topbar.tsx`, receber a prop de nome da sessão e derivar as iniciais (primeira letra do primeiro e do último token; fallback conforme design.md)
- [ ] 3.2 Substituir "Ana Ribeiro" / "AR" pelo nome e iniciais derivados da sessão
- [ ] 3.3 Substituir os itens atuais do menu ("Meu perfil" / "Sair") pelos três itens: Perfil (`User`, `ROUTES.perfil`), Alterar senha (`KeyRound`, `ROUTES.alterarSenha`), Sair (`LogOut`), cada um com `className="ga-menu-item ga-row"` e ícone `lucide-react`
- [ ] 3.4 Perfil e Alterar senha navegam com `router.push` e fecham o menu (`setUserMenuOpen(false)`) ao serem acionados
- [ ] 3.5 Sair fecha o menu e chama `signOut` de `next-auth/react` redirecionando para `/`
- [ ] 3.6 Manter inalterado o restante da Topbar (busca, notificações, toggle, mecânica de abrir/fechar já existente)

## 4. Verificação

- [ ] 4.1 `npm run lint`
- [ ] 4.2 Testar manualmente: login, iniciais/nome corretos na barra superior, abrir/fechar o menu (clique, clique-fora, `Esc`), navegar por Perfil e Alterar senha (esperado 404, pois as telas não existem ainda), Sair encerra a sessão e volta para `/`, sem conseguir voltar a `/app` pelo botão voltar do navegador
