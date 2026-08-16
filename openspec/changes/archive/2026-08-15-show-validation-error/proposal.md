## Why

A especificação `autenticacao` já exige que a tela de entrada apresente uma mensagem de erro quando o e-mail ou a senha estão incorretos, mas a implementação atual de `LoginForm.tsx` não cumpre isso: ao errar a senha (ou usar um e-mail não cadastrado), nenhuma mensagem aparece. A causa é que `signIn("credentials", { redirect: false })` do Auth.js v5 pode rejeitar a Promise em vez de resolver com `{ error }` para credenciais inválidas, e o código atual não tem `try/catch` — a rejeição não tratada deixa `hasError` sempre `false` (e o botão preso em "Entrando…", já que `setIsSubmitting(false)` nunca é alcançado no caminho de erro).

## What Changes

- `LoginForm.tsx` passa a envolver a chamada a `signIn` em `try/catch`, tratando tanto uma rejeição da Promise quanto um retorno com `result.error`/`!result` como falha de autenticação, sempre restaurando `isSubmitting` e ativando `hasError`.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

(nenhuma — `autenticacao` já especifica esse comportamento nos cenários "Senha incorreta" e "E-mail não cadastrado" de `openspec/specs/autenticacao/spec.md`; esta change apenas corrige a implementação para cumprir o requisito existente, sem alterar o que é especificado)

## Impact

- `components/auth/LoginForm.tsx`: tratamento de erro do `signIn`.
- Nenhuma alteração em `auth.ts`, `auth.config.ts` ou nas specs.
