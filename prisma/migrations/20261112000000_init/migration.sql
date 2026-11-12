CREATE TABLE "usuarios" (
 "id" UUID NOT NULL, "nome" VARCHAR(100) NOT NULL, "email" VARCHAR(255) NOT NULL,
 "senha_hash" TEXT NOT NULL, "criado_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
CREATE TABLE "tarefas" (
 "id" UUID NOT NULL, "usuario_id" UUID NOT NULL, "titulo" VARCHAR(100) NOT NULL,
 "descricao" VARCHAR(500), "situacao" VARCHAR(20) NOT NULL DEFAULT 'pendente',
 "criado_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "atualizado_em" TIMESTAMPTZ(6) NOT NULL,
 CONSTRAINT "tarefas_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "tarefas_situacao_check" CHECK ("situacao" IN ('pendente','concluida'))
);
CREATE INDEX "tarefas_usuario_id_criado_em_idx" ON "tarefas"("usuario_id", "criado_em" DESC);
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;