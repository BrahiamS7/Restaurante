import prisma from "../utils/prisma.js";

export async function crearMesa(req, res) {
  try {
    await prisma.mesa.create({
      data: {},
    });
    return res.status(201).json({ msg: "Mesa creada exitosamente" });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function obtenerMesas(req, res) {
  try {
    const mesas = await prisma.mesa.findMany({
      include: {
        mesero: {
          select: { nombre: true },
        },
      },
    });
    if (mesas.length === 0) {
      return res.status(404).json({ msg: "No se encontraron mesas" });
    }
    return res.status(200).json({ msg: "Mesas obtenidas exitosamente", mesas });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function obtenerMesaPorId(req, res) {
  try {
    const mesa_id = Number(req.params.id);
    if (
      typeof mesa_id !== "number" ||
      !Number.isInteger(mesa_id) ||
      mesa_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de mesa invalido!" });
    }
    const mesa = await prisma.mesa.findUnique({
      where: {
        id: mesa_id,
      },
      include: {
        mesero: {
          select: { nombre: true },
        },
      },
    });
    if (!mesa) {
      return res.status(404).json({ msg: "Mesa no encontrada" });
    }
    return res.status(200).json({ msg: "Mesa obtenida exitosamente", mesa });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}
