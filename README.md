This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup

1. Copie `.env.example` para `.env` na raiz do projeto e ajuste `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` e `NEXTAUTH_SECRET` (gere este último com `openssl rand -base64 32`). `DATABASE_URL` precisa ficar coerente com as três variáveis `POSTGRES_*` — o Prisma lê só o `DATABASE_URL`.
2. Se a porta 5432 já estiver em uso na máquina hospedeira, defina `POSTGRES_HOST_PORT` em `.devcontainer/.env` (não em `.env` — o Compose interpola essa variável a partir do diretório do arquivo de composição).
3. Suba o ambiente de desenvolvimento (rebuild do devcontainer ou `docker compose up -d` a partir de `.devcontainer/`). O serviço `db` (PostgreSQL) é provisionado automaticamente e o `app` só inicia depois que o banco responde à verificação de saúde.

### Banco de dados

Os dados do PostgreSQL ficam em um volume nomeado (`pgdata`) e sobrevivem a paradas, reinicializações e reconstruções do devcontainer.

- Alterar `POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB` no `.env` **não** afeta um banco já inicializado — essas variáveis só têm efeito na primeira inicialização do volume. Para aplicar novas credenciais a um banco existente, use `ALTER USER`/`ALTER DATABASE` ou descarte o volume.
- Para reinicializar o banco do zero: `docker compose -f .devcontainer/docker-compose.yml down` seguido de `docker volume rm jornada-fiscal_pgdata` (confira o nome exato com `docker volume ls`), depois suba o ambiente novamente.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
