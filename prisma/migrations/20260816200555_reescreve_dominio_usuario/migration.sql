-- CreateTable
CREATE TABLE "usuario" (
    "usr_id" UUID NOT NULL,
    "usr_username" VARCHAR(60) NOT NULL,
    "usr_nome" VARCHAR(100) NOT NULL,
    "usr_email" VARCHAR(120) NOT NULL,
    "usr_email_secundario" VARCHAR(120),
    "usr_password" TEXT NOT NULL,
    "usr_telefone" VARCHAR(60),
    "usr_image" TEXT,
    "origem_id" INTEGER NOT NULL,
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("usr_id")
);

-- CreateTable
CREATE TABLE "usuario_origem" (
    "origem_id" SERIAL NOT NULL,
    "origem_nome" VARCHAR(60) NOT NULL,
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "usuario_origem_pkey" PRIMARY KEY ("origem_id")
);

-- CreateTable
CREATE TABLE "situacao" (
    "situacao_id" SERIAL NOT NULL,
    "situacao_nome" VARCHAR(60) NOT NULL,
    "situacao_desc" TEXT NOT NULL,
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "situacao_pkey" PRIMARY KEY ("situacao_id")
);

-- CreateTable
CREATE TABLE "usuario_situacao" (
    "usr_id" UUID NOT NULL,
    "situacao_id" INTEGER NOT NULL,
    "vigencia_inicio" TIMESTAMP(3) NOT NULL,
    "vigencia_fim" TIMESTAMP(3),
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "usuario_situacao_pkey" PRIMARY KEY ("usr_id","situacao_id","vigencia_inicio")
);

-- CreateTable
CREATE TABLE "sistema" (
    "sistema_id" SERIAL NOT NULL,
    "sistema_nome" VARCHAR(60) NOT NULL,
    "sistema_desc" TEXT NOT NULL,
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "sistema_pkey" PRIMARY KEY ("sistema_id")
);

-- CreateTable
CREATE TABLE "usuario_id_externo" (
    "usr_id" UUID NOT NULL,
    "usr_id_externo" TEXT NOT NULL,
    "sistema_id" INTEGER NOT NULL,
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "usuario_id_externo_pkey" PRIMARY KEY ("usr_id","usr_id_externo","sistema_id")
);

-- CreateTable
CREATE TABLE "cargo" (
    "cargo_id" SERIAL NOT NULL,
    "cargo_nome" VARCHAR(60) NOT NULL,
    "cargo_efetivo" BOOLEAN NOT NULL,
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "cargo_pkey" PRIMARY KEY ("cargo_id")
);

-- CreateTable
CREATE TABLE "usuario_cargo" (
    "usr_id" UUID NOT NULL,
    "cargo_id" INTEGER NOT NULL,
    "vigencia_inicio" TIMESTAMP(3) NOT NULL,
    "vigencia_fim" TIMESTAMP(3),
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "usuario_cargo_pkey" PRIMARY KEY ("usr_id","cargo_id","vigencia_inicio")
);

-- CreateTable
CREATE TABLE "setor" (
    "setor_id" SERIAL NOT NULL,
    "setor_pai" INTEGER,
    "setor_sigla" VARCHAR(12) NOT NULL,
    "setor_nome" VARCHAR(60) NOT NULL,
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "setor_pkey" PRIMARY KEY ("setor_id")
);

-- CreateTable
CREATE TABLE "usuario_lotacao" (
    "usr_id" UUID NOT NULL,
    "setor_id" INTEGER NOT NULL,
    "vigencia_inicio" TIMESTAMP(3) NOT NULL,
    "vigencia_fim" TIMESTAMP(3),
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "usuario_lotacao_pkey" PRIMARY KEY ("usr_id","setor_id","vigencia_inicio")
);

-- CreateTable
CREATE TABLE "perfil" (
    "perfil_id" SERIAL NOT NULL,
    "perfil_nome" VARCHAR(60) NOT NULL,
    "perfil_desc" TEXT NOT NULL,
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "perfil_pkey" PRIMARY KEY ("perfil_id")
);

-- CreateTable
CREATE TABLE "funcionalidade" (
    "func_id" SERIAL NOT NULL,
    "func_nome" VARCHAR(60) NOT NULL,
    "func_desc" TEXT NOT NULL,
    "func_categoria_id" INTEGER NOT NULL,
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "funcionalidade_pkey" PRIMARY KEY ("func_id")
);

-- CreateTable
CREATE TABLE "func_categoria" (
    "func_categoria_id" SERIAL NOT NULL,
    "func_categoria_nome" VARCHAR(60) NOT NULL,
    "func_categoria_desc" TEXT NOT NULL,
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "func_categoria_pkey" PRIMARY KEY ("func_categoria_id")
);

-- CreateTable
CREATE TABLE "perfil_funcionalidade" (
    "perfil_id" INTEGER NOT NULL,
    "func_id" INTEGER NOT NULL,
    "vigencia_inicio" TIMESTAMP(3) NOT NULL,
    "vigencia_fim" TIMESTAMP(3),
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "perfil_funcionalidade_pkey" PRIMARY KEY ("perfil_id","func_id","vigencia_inicio")
);

-- CreateTable
CREATE TABLE "usuario_perfil" (
    "usr_id" UUID NOT NULL,
    "perfil_id" INTEGER NOT NULL,
    "vigencia_inicio" TIMESTAMP(3) NOT NULL,
    "vigencia_fim" TIMESTAMP(3),
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "usuario_perfil_pkey" PRIMARY KEY ("usr_id","perfil_id","vigencia_inicio")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_usr_username_key" ON "usuario"("usr_username");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_usr_email_key" ON "usuario"("usr_email");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_origem_id_fkey" FOREIGN KEY ("origem_id") REFERENCES "usuario_origem"("origem_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_origem" ADD CONSTRAINT "usuario_origem_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_origem" ADD CONSTRAINT "usuario_origem_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "situacao" ADD CONSTRAINT "situacao_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "situacao" ADD CONSTRAINT "situacao_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_situacao" ADD CONSTRAINT "usuario_situacao_usr_id_fkey" FOREIGN KEY ("usr_id") REFERENCES "usuario"("usr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_situacao" ADD CONSTRAINT "usuario_situacao_situacao_id_fkey" FOREIGN KEY ("situacao_id") REFERENCES "situacao"("situacao_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_situacao" ADD CONSTRAINT "usuario_situacao_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_situacao" ADD CONSTRAINT "usuario_situacao_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sistema" ADD CONSTRAINT "sistema_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sistema" ADD CONSTRAINT "sistema_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_id_externo" ADD CONSTRAINT "usuario_id_externo_usr_id_fkey" FOREIGN KEY ("usr_id") REFERENCES "usuario"("usr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_id_externo" ADD CONSTRAINT "usuario_id_externo_sistema_id_fkey" FOREIGN KEY ("sistema_id") REFERENCES "sistema"("sistema_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_id_externo" ADD CONSTRAINT "usuario_id_externo_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_id_externo" ADD CONSTRAINT "usuario_id_externo_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cargo" ADD CONSTRAINT "cargo_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cargo" ADD CONSTRAINT "cargo_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_cargo" ADD CONSTRAINT "usuario_cargo_usr_id_fkey" FOREIGN KEY ("usr_id") REFERENCES "usuario"("usr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_cargo" ADD CONSTRAINT "usuario_cargo_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "cargo"("cargo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_cargo" ADD CONSTRAINT "usuario_cargo_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_cargo" ADD CONSTRAINT "usuario_cargo_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "setor" ADD CONSTRAINT "setor_setor_pai_fkey" FOREIGN KEY ("setor_pai") REFERENCES "setor"("setor_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "setor" ADD CONSTRAINT "setor_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "setor" ADD CONSTRAINT "setor_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_lotacao" ADD CONSTRAINT "usuario_lotacao_usr_id_fkey" FOREIGN KEY ("usr_id") REFERENCES "usuario"("usr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_lotacao" ADD CONSTRAINT "usuario_lotacao_setor_id_fkey" FOREIGN KEY ("setor_id") REFERENCES "setor"("setor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_lotacao" ADD CONSTRAINT "usuario_lotacao_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_lotacao" ADD CONSTRAINT "usuario_lotacao_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfil" ADD CONSTRAINT "perfil_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfil" ADD CONSTRAINT "perfil_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "funcionalidade" ADD CONSTRAINT "funcionalidade_func_categoria_id_fkey" FOREIGN KEY ("func_categoria_id") REFERENCES "func_categoria"("func_categoria_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcionalidade" ADD CONSTRAINT "funcionalidade_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "funcionalidade" ADD CONSTRAINT "funcionalidade_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "func_categoria" ADD CONSTRAINT "func_categoria_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "func_categoria" ADD CONSTRAINT "func_categoria_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfil_funcionalidade" ADD CONSTRAINT "perfil_funcionalidade_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfil"("perfil_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_funcionalidade" ADD CONSTRAINT "perfil_funcionalidade_func_id_fkey" FOREIGN KEY ("func_id") REFERENCES "funcionalidade"("func_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_funcionalidade" ADD CONSTRAINT "perfil_funcionalidade_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfil_funcionalidade" ADD CONSTRAINT "perfil_funcionalidade_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_perfil" ADD CONSTRAINT "usuario_perfil_usr_id_fkey" FOREIGN KEY ("usr_id") REFERENCES "usuario"("usr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_perfil" ADD CONSTRAINT "usuario_perfil_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfil"("perfil_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_perfil" ADD CONSTRAINT "usuario_perfil_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_perfil" ADD CONSTRAINT "usuario_perfil_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
