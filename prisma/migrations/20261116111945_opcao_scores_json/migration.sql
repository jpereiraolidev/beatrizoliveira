/*
  Warnings:

  - You are about to drop the `alternativas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `analytics_eventos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `leads_diagnostico` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `perguntas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "alternativas" DROP CONSTRAINT "alternativas_perguntaId_fkey";

-- DropForeignKey
ALTER TABLE "analytics_eventos" DROP CONSTRAINT "analytics_eventos_sessaoId_fkey";

-- DropTable
DROP TABLE "alternativas";

-- DropTable
DROP TABLE "analytics_eventos";

-- DropTable
DROP TABLE "leads_diagnostico";

-- DropTable
DROP TABLE "perguntas";

-- CreateTable
CREATE TABLE "Pergunta" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,

    CONSTRAINT "Pergunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opcao" (
    "id" TEXT NOT NULL,
    "letra" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "scores" JSONB NOT NULL,
    "perguntaId" TEXT NOT NULL,

    CONSTRAINT "Opcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "pesosReferencia" JSONB NOT NULL,
    "respostaPadrao" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "telefone" TEXT,
    "perfilId" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pergunta_numero_key" ON "Pergunta"("numero");

-- AddForeignKey
ALTER TABLE "Opcao" ADD CONSTRAINT "Opcao_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE SET NULL ON UPDATE CASCADE;
