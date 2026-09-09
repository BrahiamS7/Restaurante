-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'CANCELADO', 'FACTURADO');

-- CreateEnum
CREATE TYPE "estadoM" AS ENUM ('LIBRE', 'OCUPADA', 'RESERVADA');

-- CreateEnum
CREATE TYPE "estadoT" AS ENUM ('ABIERTO', 'CERRADO');

-- CreateTable
CREATE TABLE "Administrador" (
    "id" SERIAL NOT NULL,
    "usuario" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,

    CONSTRAINT "Administrador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mesero" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Mesero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contenido" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "observaciones" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "pedido_id" INTEGER NOT NULL,

    CONSTRAINT "Contenido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mesa" (
    "id" SERIAL NOT NULL,
    "estadoM" "estadoM" NOT NULL DEFAULT 'LIBRE',
    "mesero_id" INTEGER,

    CONSTRAINT "Mesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turno" (
    "id" SERIAL NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fin" TIMESTAMP(3),
    "estado" "estadoT" NOT NULL DEFAULT 'ABIERTO',
    "total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'PENDIENTE',
    "total" DECIMAL(10,2) NOT NULL,
    "mesero_id" INTEGER NOT NULL,
    "turno_id" INTEGER NOT NULL,
    "mesa_id" INTEGER NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contenido" ADD CONSTRAINT "Contenido_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contenido" ADD CONSTRAINT "Contenido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mesa" ADD CONSTRAINT "Mesa_mesero_id_fkey" FOREIGN KEY ("mesero_id") REFERENCES "Mesero"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_mesero_id_fkey" FOREIGN KEY ("mesero_id") REFERENCES "Mesero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_turno_id_fkey" FOREIGN KEY ("turno_id") REFERENCES "Turno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_mesa_id_fkey" FOREIGN KEY ("mesa_id") REFERENCES "Mesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
