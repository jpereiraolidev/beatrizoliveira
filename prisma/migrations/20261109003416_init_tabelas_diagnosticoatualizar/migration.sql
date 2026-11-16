/*
  Warnings:

  - You are about to drop the column `eixoAlvo` on the `alternativas` table. All the data in the column will be lost.
  - You are about to drop the column `peso` on the `alternativas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[perguntaId,letra]` on the table `alternativas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scores` to the `alternativas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "alternativas" DROP COLUMN "eixoAlvo",
DROP COLUMN "peso",
ADD COLUMN     "scores" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "alternativas_perguntaId_letra_key" ON "alternativas"("perguntaId", "letra");
