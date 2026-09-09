import prisma from "../utils/prisma.js";
import { Prisma } from "../generated/prisma/index.js";

export async function crearTurno(req, res) {
  try {
    const turnoAbierto = await prisma.turno.findFirst({
      where: { estado: "ABIERTO" },
    });

    if (turnoAbierto) {
      return res.status(400).json({ msg: "Ya existe un turno abierto" });
    }
    await prisma.turno.create({
      data: {
        total: 0,
      },
    });
    return res.status(201).json({ msg: "Turno creado correctamente" });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function obtenerTurnos(req, res) {
  try {
    const turnos = await prisma.turno.findMany();
    if (turnos.length === 0) {
      return res.status(404).json({ msg: "No se encontraron turnos" });
    }
    return res
      .status(200)
      .json({ msg: "Turnos obtenidos correctamente", turnos });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}
export async function obtenerTurnoPorId(req, res) {
  try {
    const turno_id = Number(req.params.id);
    if (
      typeof turno_id !== "number" ||
      !Number.isInteger(turno_id) ||
      turno_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de turno invalido!" });
    }
    const turno = await prisma.turno.findUnique({
      where: {
        id: turno_id,
      },
    });
    if (!turno) {
      return res.status(404).json({ msg: "Turno no encontrado" });
    }
    return res.status(200).json({ msg: "Turno obtenido correctamente", turno });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function turnoActual(req, res) {
  try {
    const turno = await prisma.turno.findFirst({
      where: {
        estado: "ABIERTO",
      },
    });
    if (!turno) {
      return res.status(404).json({ msg: "Turno no encontrado" });
    }
    return res.status(200).json({ msg: "Turno obtenido correctamente", turno });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function cerrarTurno(req, res) {
  try {
    const turno_id = Number(req.params.id);
    if (
      typeof turno_id !== "number" ||
      !Number.isInteger(turno_id) ||
      turno_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de turno invalido!" });
    }
    const pedidosTurno = await prisma.pedido.findMany({
      where: {
        turno_id: turno_id,
      },
    });
    const hayPedidosSinFacturar = pedidosTurno.some(
      (pedido) =>
        pedido.estado !== "FACTURADO" && pedido.estado !== "CANCELADO",
    );

    if (hayPedidosSinFacturar) {
      return res
        .status(400)
        .json({ msg: "No se puede cerrar el turno, hay pedidos sin facturar" });
    }
    const horaFin = new Date();
    const totalTurno = pedidosTurno.reduce(
      (acumulado, pedido) => acumulado.plus(pedido.total),
      new Prisma.Decimal(0),
    );
    const turno = await prisma.turno.update({
      where: {
        id: turno_id,
      },
      data: {
        fin: horaFin,
        estado: "CERRADO",
        total: totalTurno,
      },
    });

    return res.status(200).json({ msg: "Turno cerrado correctamente", turno });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}
