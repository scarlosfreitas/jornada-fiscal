-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefone" TEXT,
    "image" TEXT,
    "cargo" TEXT,
    "lotacao" TEXT,
    "sq_situacao" INTEGER NOT NULL DEFAULT 1,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioPerfil" (
    "usuarioId" TEXT NOT NULL,
    "perfilId" TEXT NOT NULL,

    CONSTRAINT "UsuarioPerfil_pkey" PRIMARY KEY ("usuarioId","perfilId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_nome_key" ON "Perfil"("nome");

-- AddForeignKey
ALTER TABLE "UsuarioPerfil" ADD CONSTRAINT "UsuarioPerfil_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioPerfil" ADD CONSTRAINT "UsuarioPerfil_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;
