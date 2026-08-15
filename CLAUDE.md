# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## O que é este projeto

Gertor de Alertas — sistema de apoio à jornada fiscal (rotina de um auditor fiscal), construído em Next.js 16 (App Router) + React 19 + TypeScript.

A fonte da verdade do produto é `docs/PRD.md` — leia-o antes de implementar qualquer funcionalidade nova. A fonte da verdade das regras de negócio é `references/domain/regras-negocio.md`. Não implemente comportamento que não esteja coberto por um desses dois arquivos sem antes perguntar.

## Comandos

```bash
npm run dev     # inicia o servidor de desenvolvimento (Next.js)
npm run build   # build de produção
npm run start   # sobe o build de produção
npm run lint    # eslint (eslint-config-next: core-web-vitals + typescript)
```

Não há suíte de testes configurada no projeto ainda (sem Jest/Vitest e sem script `test` no `package.json`).

## Arquitetura

- **App Router puro em `app/`** — ainda no estágio inicial (boilerplate do `create-next-app`); `app/page.tsx` e o `<title>` em `app/layout.tsx` ainda não foram adaptados ao produto real.
- **`app/gestor-alertas.css`** é a folha de estilo global do design system do produto (tokens de cor `--ga-*`, ~160 classes `.ga-*` para sidebar, topbar, cards, tabelas, badges, chips, botões etc.), já pronta e alinhada aos protótipos de `references/design/`. O cabeçalho do próprio arquivo documenta duas regras obrigatórias: importar essa folha **uma única vez** no layout raiz, e **não instalar/usar Tailwind** para estilizar componentes do produto — apesar de o Tailwind vir pré-instalado pelo boilerplate do create-next-app (`globals.css`, `postcss.config.mjs`), a intenção é que todo componente novo use as classes `ga-*` existentes. O shell da aplicação (sidebar + topbar + conteúdo + rodapé) deve ser montado uma única vez no layout do dashboard; cada página deve renderizar apenas o conteúdo interno de `<main class="ga-content">`.
- **Auth/DB estão scaffolded mas não implementados**: `next-auth` v5 (beta) + `@auth/prisma-adapter` + `@prisma/client` estão nas dependências e `.env` já tem `DATABASE_URL`/`NEXTAUTH_SECRET`/`NEXTAUTH_URL`, mas **não existe `prisma/schema.prisma`** — o schema do banco ainda precisa ser criado a partir do domínio em `references/domain/regras-negocio.md`.
- **`kafkajs`, `@aws-sdk/client-s3`, `ioredis`** estão instalados para integração futura com a plataforma de dados (Kafka, object storage compatível com S3/MinIO, cache) — essa plataforma é um projeto externo/independente (ver `docs/PRD.md`, seção "Fora do escopo"); não recriar essa infraestrutura aqui, apenas consumi-la.
- **Fluxo de trabalho de especificação**: o projeto usa OpenSpec (`openspec/config.yaml`, ainda sem changes/specs registradas) e há skills `opsx:*`/`openspec-*` disponíveis para propor, aplicar e arquivar changes de forma spec-driven. Ao planejar uma feature não trivial, prefira propor uma change OpenSpec antes de implementar.

### Lendo os arquivos de `references/design/*.html`

Essas 10 páginas (`Landing`, `Dashboard`, `RegrasAlerta`, `AlertasGerados`, `Monitoramento`, `Contribuinte`, `OrdensServico`, `ListaUsuarios`, `Perfis`, `DesignSystem`) são exports "bundled" de um protótipo React (ferramenta de design), não HTML comum — cada arquivo tem ~386 linhas, mas duas delas somam centenas de KB/MB porque carregam fontes/imagens em base64 (linha do manifest) e o código real da página como uma *string* JSON de uma linha só (script `type="__bundler/template"`, penúltima linha do arquivo). Ferramentas de leitura padrão estouram limite de tamanho nesses arquivos. Para extrair o conteúdo real de uma página:

1. Pegue a penúltima linha do arquivo (script `__bundler/template`) — é uma string JSON.
2. Faça `JSON.parse` dela para obter o HTML decodificado.
3. Dentro desse HTML, o texto/dados reais (nav, tabelas, mocks, regras) estão em um `<script type="text/x-dc">` perto do fim — o resto do HTML é só o template com placeholders `{{ }}` / `sc-for` / `sc-if`.

Exemplo rápido (bash + python):
```bash
sed -n '384p' references/design/Dashboard.html > /tmp/t.json   # linha do template pode variar; confira com: grep -n '__bundler/template' arquivo.html
python3 -c "import json; print(json.loads(open('/tmp/t.json').read().strip()))" > /tmp/Dashboard.html
```

## Domínio (resumo — ver `docs/PRD.md` e `references/domain/regras-negocio.md` para os detalhes)

Quatro pilares: **regras/alertas** (gatilhos de documentos eletrônicos, cadastro, RedeSim, dados abertos → níveis amarelo/indicação, vermelho/alerta, cinza/intervenção), **ordens de serviço** de intervenção (vistoria em trânsito/estabelecimento/sigilosa; situações aberta→solicitada→delegada→concluída/rejeitada/decaída), **canais de comunicação** (tela, Telegram, e-mail, Prodoc, pessoal) e **jornada do contribuinte** (timeline + situação cadastral + declarações + recolhimentos + documentos emitidos, com histórico por campo). Perfis de acesso: Usuário, Administrador, Cadastrador, Bloqueador de Cadastro, Validador de Cadastro.
