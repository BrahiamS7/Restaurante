-- CreateEnum
CREATE TYPE "categoria" AS ENUM ('PLATO_FUERTE', 'ENTRADA', 'BEBIDA', 'POSTRE', 'OTRO');

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "categoria" "categoria" NOT NULL DEFAULT 'OTRO';
