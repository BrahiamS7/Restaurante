-- AlterTable
ALTER TABLE "Contenido" ALTER COLUMN "observaciones" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Mesero" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true;
