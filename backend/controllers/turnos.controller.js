import prisma from "../utils/prisma.js";
import { Prisma } from "../generated/prisma/index.js";
import { manejarError } from "../utils/manejarError.js";

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
    return manejarError(error, res);
  }
}

export async function obtenerTurnos(req, res) {
  try {
    const { desde, hasta } = req.query;

    const filtro = {};

    if (desde) {
      filtro.inicio = { ...filtro.inicio, gte: new Date(desde) };
    }
    if (hasta) {
      filtro.inicio = { ...filtro.inicio, lte: new Date(hasta) };
    }

    const turnos = await prisma.turno.findMany({
      where: filtro,
      orderBy: { inicio: "desc" },
      include: {
        pedidos: {
          where: { estado: "FACTURADO" },
          select: { total: true },
        },
      },
    });

    if (turnos.length === 0) {
      return res.status(404).json({ msg: "No se encontraron turnos" });
    }

    const turnosConTotal = turnos.map((turno) => {
      if (turno.estado === "ABIERTO") {
        const totalCalculado = turno.pedidos.reduce(
          (acumulado, pedido) => acumulado.plus(pedido.total),
          new Prisma.Decimal(0),
        );
        return { ...turno, total: totalCalculado.toNumber() };
      }
      return turno;
    });

    return res
      .status(200)
      .json({ msg: "Turnos obtenidos correctamente", turnos: turnosConTotal });
  } catch (error) {
    return manejarError(error, res);
  }
}

export async function obtenerTurnoPorId(req, res) {
  try {
    const turno_id = Number(req.params.id);

    if (!Number.isInteger(turno_id) || turno_id <= 0) {
      return res.status(400).json({
        msg: "Codigo de turno invalido!",
      });
    }

    const turno = await prisma.turno.findUnique({
      where: {
        id: turno_id,
      },
      include: {
        pedidos: {
          include: {
            contenidos: {
              include: {
                producto: true,
              },
            },
            mesero: true,
            mesa: true,
          },
        },
      },
    });

    if (!turno) {
      return res.status(404).json({
        msg: "Turno no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Turno obtenido correctamente",
      turno,
    });
  } catch (error) {
    return manejarError(error, res);
  }
}

export async function turnoActual(req, res) {
  try {
    const turno = await prisma.turno.findFirst({
      where: {
        estado: "ABIERTO",
      },
      include: {
        pedidos: {
          where: {
            estado: "FACTURADO",
          },
          select: { total: true },
        },
      },
    });
    if (!turno) {
      return res.status(404).json({ msg: "Turno no encontrado" });
    }
    const totalCalculado = turno.pedidos.reduce(
      (acumulado, pedido) => acumulado.plus(pedido.total),
      new Prisma.Decimal(0),
    );
    return res.status(200).json({
      msg: "Turno obtenido correctamente",
      turno: {
        ...turno,
        total: totalCalculado.toNumber(),
      },
    });
  } catch (error) {
    return manejarError(error, res);
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
    return manejarError(error, res);
  }
}
