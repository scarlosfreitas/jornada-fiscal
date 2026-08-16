## Why

O projeto tem `@prisma/client`, `prisma` e `@auth/prisma-adapter` instalados e um `DATABASE_URL` no `.env` da raiz, mas **não há banco algum**: o `docker-compose.yml` do devcontainer sobe um único serviço (`app`), e o `DATABASE_URL` atual é um resquício do boilerplate — aponta para `mysql://…@localhost:3306/`, ou seja, protocolo errado (MySQL, não PostgreSQL) e host errado (dentro do container `app`, `localhost` não é o banco). Enquanto isso não for corrigido, não dá para criar o `prisma/schema.prisma`, rodar migrations ou implementar autenticação — tudo o que depende de persistência fica bloqueado.

## What Changes

- Novo serviço `db` (PostgreSQL) no `.devcontainer/docker-compose.yml`, com volume nomeado para os dados persistirem entre recriações do container, healthcheck e porta publicada no host para acesso por ferramentas externas.
- O serviço `app` passa a depender do `db` estar saudável antes de subir.
- **BREAKING**: o `DATABASE_URL` do `.env` da raiz é substituído — de `mysql://…@localhost:3306/` para uma URL PostgreSQL apontando para o serviço `db`. Qualquer configuração local apontando para o valor antigo deixa de valer.
- As credenciais do banco (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) passam a viver no `.env` da raiz, consumido pelo serviço `db` via `env_file`, de forma que a URL da aplicação e as credenciais do container tenham uma única fonte.
- Novo `.env.example` versionado, documentando todas as chaves com valores de exemplo. Hoje `.env*` é ignorado pelo git e não há nenhum modelo — quem clona o repositório não tem como saber quais variáveis existem.

## Capabilities

### New Capabilities
- `local-dev-database`: o banco PostgreSQL do ambiente de desenvolvimento — como ele é provisionado junto do devcontainer, onde ficam suas credenciais, como a aplicação o alcança e que garantias de persistência ele oferece.

### Modified Capabilities
Nenhuma.

## Impact

- **Arquivos**: `.devcontainer/docker-compose.yml` (modificado), `.env` da raiz (modificado, não versionado), `.env.example` (novo, versionado), `.gitignore` (exceção para `.env.example`), `README.md` (instruções de setup).
- **Dependências**: nenhuma dependência npm. Uma imagem Docker nova (`postgres`).
- **Operacional**: a primeira subida após esta change baixa a imagem do Postgres e inicializa o cluster; o `app` só sobe depois do healthcheck passar. Recriar o devcontainer não apaga os dados — apagar o volume nomeado, sim.
- **Fora do escopo**: `prisma/schema.prisma`, migrations, seed, e a configuração do NextAuth com o adapter Prisma — cada um é change própria. Esta change entrega apenas o banco disponível e alcançável.
- **Fora do escopo**: banco de homologação/produção. Isto é ambiente de desenvolvimento local.
