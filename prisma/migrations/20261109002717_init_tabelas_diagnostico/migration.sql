-- CreateTable
CREATE TABLE "leads_diagnostico" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "segmento" TEXT,
    "tempoTotalSegundos" INTEGER NOT NULL,
    "respostasJson" JSONB NOT NULL,
    "respostaAberta" TEXT,
    "perfilResultante" TEXT NOT NULL,
    "gargaloPrincipal" TEXT NOT NULL,

    CONSTRAINT "leads_diagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_eventos" (
    "id" TEXT NOT NULL,
    "sessaoId" TEXT NOT NULL,
    "perguntaNumero" INTEGER NOT NULL,
    "tempoGastoSegundos" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perguntas" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "bloco" INTEGER NOT NULL,
    "enunciado" TEXT NOT NULL,

    CONSTRAINT "perguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alternativas" (
    "id" SERIAL NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "letra" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "eixoAlvo" TEXT NOT NULL,
    "peso" INTEGER NOT NULL,

    CONSTRAINT "alternativas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "perguntas_numero_key" ON "perguntas"("numero");

-- AddForeignKey
ALTER TABLE "analytics_eventos" ADD CONSTRAINT "analytics_eventos_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "leads_diagnostico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alternativas" ADD CONSTRAINT "alternativas_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "perguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
