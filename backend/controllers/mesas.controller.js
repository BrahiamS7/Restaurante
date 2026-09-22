import prisma from "../utils/prisma.js";
import { manejarError } from "../utils/manejarError.js";

export async function crearMesa(req, res) {
  try {
    await prisma.mesa.create({
      data: {},
    });
    return res.status(201).json({ msg: "Mesa creada exitosamente" });
  } catch (error) {
    return manejarError(error, res);
  }
}

export async function obtenerMesas(req, res) {
  try {
    const { activo } = req.query;

    const filtro = activo === "todos" ? {} : { activo: true };

    const mesas = await prisma.mesa.findMany({
      where: filtro,
      include: {
        mesero: { select: { nombre: true } },
      },
    });

    return res.status(200).json({ msg: "Mesas obtenidas exitosamente", mesas });
  } catch (error) {
    return manejarError(error, res);
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
    return manejarError(error, res);
  }
}

export async function desactivarMesa(req, res) {
  try {
    const mesa_id = Number(req.params.id);
    if (
      typeof mesa_id !== "number" ||
      !Number.isInteger(mesa_id) ||
      mesa_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de mesa invalido!" });
    }
    const mesaActual = await prisma.mesa.findUnique({
      where: { id: mesa_id },
    });
    if (!mesaActual) {
      return res.status(404).json({ msg: "Mesa no encontrada" });
    }
    if (mesaActual.estadoM === "OCUPADA") {
      return res
        .status(400)
        .json({ msg: "No se puede desactivar la mesa, está ocupada!" });
    }
    const mesaDesactivada = await prisma.mesa.update({
      where: {
        id: mesa_id,
      },
      data: {
        activo: false,
      },
    });
    return res
      .status(200)
      .json({ msg: "Mesa desactivada correctamente!", mesaDesactivada });
  } catch (error) {
    return manejarError(error, res);
  }
}

export async function reactivarMesa(req, res) {
  try {
    const mesa_id = Number(req.params.id);
    if (
      typeof mesa_id !== "number" ||
      !Number.isInteger(mesa_id) ||
      mesa_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de mesa invalido!" });
    }
    const mesaReactivada = await prisma.mesa.update({
      where: {
        id: mesa_id,
      },
      data: {
        activo: true,
      },
    });
    return res
      .status(200)
      .json({ msg: "Mesa reactivada correctamente!", mesaReactivada });
  } catch (error) {
    return manejarError(error, res);
  }
}
