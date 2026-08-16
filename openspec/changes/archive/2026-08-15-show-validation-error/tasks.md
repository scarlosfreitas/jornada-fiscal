## 1. Correção do fluxo de erro

- [x] 1.1 Em `components/auth/LoginForm.tsx`, envolver a chamada a `signIn` em `try/catch`, ativando `hasError` tanto no `catch` quanto no caminho existente `!result || result.error`
- [x] 1.2 Mover `setIsSubmitting(false)` para um bloco `finally`, garantindo que o botão nunca fique preso em "Entrando…"

## 2. Verificação

- [x] 2.1 `npm run lint`
- [x] 2.2 Testar manualmente: senha errada mostra "E-mail ou senha incorretos.", e-mail não cadastrado mostra a mesma mensagem, botão volta a "Entrar" em ambos os casos, login com credenciais válidas continua funcionando
