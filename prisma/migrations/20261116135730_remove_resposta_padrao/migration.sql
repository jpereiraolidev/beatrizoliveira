/*
  Warnings:

  - You are about to drop the column `respostaPadrao` on the `Perfil` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Perfil" DROP COLUMN "respostaPadrao";
