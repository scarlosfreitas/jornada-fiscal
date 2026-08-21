-- CreateTable
CREATE TABLE "contribuinte_acesso" (
    "usr_id" UUID NOT NULL,
    "cad_id" BIGINT NOT NULL,
    "acessado_em" TIMESTAMPTZ NOT NULL,
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "contribuinte_acesso_pkey" PRIMARY KEY ("usr_id","cad_id")
);

-- CreateIndex
CREATE INDEX "contribuinte_acesso_usr_id_acessado_em_idx" ON "contribuinte_acesso"("usr_id", "acessado_em" DESC);

-- AddForeignKey
ALTER TABLE "contribuinte_acesso" ADD CONSTRAINT "contribuinte_acesso_usr_id_fkey" FOREIGN KEY ("usr_id") REFERENCES "usuario"("usr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribuinte_acesso" ADD CONSTRAINT "contribuinte_acesso_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contribuinte_acesso" ADD CONSTRAINT "contribuinte_acesso_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
