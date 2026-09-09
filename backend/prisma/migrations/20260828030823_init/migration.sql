/*
  Warnings:

  - You are about to drop the column `contraseña` on the `Administrador` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuario]` on the table `Administrador` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `Administrador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Administrador" DROP COLUMN "contraseña",
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Administrador_usuario_key" ON "Administrador"("usuario");
