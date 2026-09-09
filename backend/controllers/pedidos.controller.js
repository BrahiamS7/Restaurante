import prisma from "../utils/prisma.js";
import { Prisma } from "../generated/prisma/index.js";

import fs from "fs";

export async function crearPedido(req, res) {
  try {
    const { mesero_id, mesa_id } = req.body;
    if (
      typeof mesero_id !== "number" ||
      !Number.isInteger(mesero_id) ||
      mesero_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de mesero invalido!" });
    }
    if (
      typeof mesa_id !== "number" ||
      !Number.isInteger(mesa_id) ||
      mesa_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de mesa invalida!" });
    }

    const turnoActivo = await prisma.turno.findFirst({
      where: { estado: "ABIERTO" },
    });

    if (!turnoActivo) {
      return res.status(400).json({
        msg: "No hay ningún turno abierto, no se puede crear el pedido",
      });
    }

    const [pedido] = await prisma.$transaction([
      prisma.pedido.create({
        data: {
          total: 0,
          mesero_id,
          turno_id: turnoActivo.id,
          mesa_id,
        },
      }),
      prisma.mesa.update({
        where: {
          id: mesa_id,
        },
        data: {
          estadoM: "OCUPADA",
          mesero_id,
        },
      }),
    ]);
    return res.status(201).json({ msg: "pedido creado correctamente", pedido });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function obtenerPedidos(req, res) {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: {
        estado: {
          in: ["PENDIENTE", "EN_PROCESO"],
        },
      },
      include: {
        mesero: {
          select: {
            nombre: true,
          },
        },
        contenidos: {
          select: {
            cantidad: true,
            observaciones: true,
            precio: true,
            producto: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
    });

    if (pedidos.length === 0) {
      return res.status(400).json({ msg: "No hay pedidos que mostrar" });
    }
    const pedidosConTotal = pedidos.map((pedido) => {
      const total = pedido.contenidos.reduce(
        (acumulado, item) => acumulado.plus(item.precio),
        new Prisma.Decimal(0),
      );
      return {
        ...pedido,
        totalActual: total.toNumber(),
      };
    });
    return res
      .status(200)
      .json({ msg: "Pedidos obtenidos correctamente!", pedidosConTotal });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function obtenerPedidoPorId(req, res) {
  try {
    const pedido_id = Number(req.params.id);
    if (
      typeof pedido_id !== "number" ||
      !Number.isInteger(pedido_id) ||
      pedido_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de pedido invalido!" });
    }
    const pedido = await prisma.pedido.findUnique({
      where: {
        id: pedido_id,
      },
      include: {
        mesero: {
          select: {
            nombre: true,
          },
        },
        contenidos: {
          select: {
            cantidad: true,
            observaciones: true,
            precio: true,
            producto: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
    });
    if (!pedido) {
      return res.status(400).json({ msg: "Pedido inexistente!" });
    }

    const totalCalculado = pedido.contenidos.reduce(
      (acumulado, item) => acumulado.plus(item.precio),
      new Prisma.Decimal(0),
    );
    return res.status(200).json({
      msg: "Pedido encontrado correctamente!",
      pedido,
      totalCalculado: totalCalculado.toNumber(),
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function actualizarEstadoPedido(req, res) {
  try {
    const pedido_id = Number(req.params.id);
    const { estado } = req.body;
    if (
      typeof pedido_id !== "number" ||
      !Number.isInteger(pedido_id) ||
      pedido_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de pedido invalido!" });
    }
    const pedidoActualizado = await prisma.pedido.update({
      where: {
        id: pedido_id,
      },
      data: {
        estado,
      },
    });
    return res
      .status(200)
      .json({ msg: "Pedido actualizado correctamente!", pedidoActualizado });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function facturarPedido(req, res) {
  try {
    const pedido_id = Number(req.params.id);
    if (
      typeof pedido_id !== "number" ||
      !Number.isInteger(pedido_id) ||
      pedido_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de pedido invalido!" });
    }

    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id: pedido_id },
      include: {
        contenidos: { select: { precio: true } },
      },
    });

    if (!pedidoExistente) {
      return res.status(404).json({ msg: "Pedido inexistente!" });
    }
    if (
      pedidoExistente.estado === "CANCELADO" ||
      pedidoExistente.estado === "FACTURADO"
    ) {
      return res
        .status(400)
        .json({ msg: "Imposible facturar producto cancelado o ya facturado!" });
    }

    const totalFinal = pedidoExistente.contenidos.reduce(
      (acumulado, item) => acumulado.plus(item.precio),
      new Prisma.Decimal(0),
    );

    const [pedidoFacturado] = await prisma.$transaction([
      prisma.pedido.update({
        where: { id: pedido_id },
        data: {
          total: totalFinal,
          estado: "FACTURADO",
        },
      }),
      prisma.mesa.update({
        where: { id: pedidoExistente.mesa_id },
        data: {
          estadoM: "LIBRE",
          mesero_id: null,
        },
      }),
    ]);

    return res
      .status(200)
      .json({ msg: "Pedido facturado correctamente", pedidoFacturado });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function obtenerContenidosPorPedido(req, res) {
  try {
    const pedido_id = Number(req.params.id);
    if (
      typeof pedido_id !== "number" ||
      !Number.isInteger(pedido_id) ||
      pedido_id <= 0
    ) {
      return res.status(400).json({ msg: "Pedido invalido!" });
    }
    const listaContenidos = await prisma.contenido.findMany({
      where: {
        pedido_id,
      },
      include: {
        producto: {
          select: { nombre: true },
        },
      },
    });
    return res
      .status(200)
      .json({ msg: "Lista de contenidos exitosa!", listaContenidos });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function cancelarPedido(req, res) {
  try {
    const pedido_id = Number(req.params.id);
    if (
      typeof pedido_id !== "number" ||
      !Number.isInteger(pedido_id) ||
      pedido_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de pedido invalido!" });
    }

    const pedidoActual = await prisma.pedido.findUnique({
      where: {
        id: pedido_id,
      },
    });
    if (!pedidoActual) {
      return res.status(404).json({ msg: "Pedido no encontrado" });
    }

    const [pedido] = await prisma.$transaction([
      prisma.pedido.update({
        where: {
          id: pedido_id,
        },
        data: {
          estado: "CANCELADO",
        },
      }),
      prisma.mesa.update({
        where: {
          id: pedidoActual.mesa_id,
        },
        data: {
          estadoM: "LIBRE",
          mesero_id: null,
        },
      }),
    ]);

    return res
      .status(200)
      .json({ msg: "Pedido cancelado correctamente", pedido });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function generarTicket(req, res) {
  try {
    const pedido_id = Number(req.params.id);
    if (
      typeof pedido_id !== "number" ||
      !Number.isInteger(pedido_id) ||
      pedido_id <= 0
    ) {
      return res.status(400).json({ msg: "Pedido invalido!" });
    }
    const pedido = await prisma.pedido.findUnique({
      where: {
        id: pedido_id,
      },
      include: {
        contenidos: {
          select: {
            cantidad: true,
            precio: true,
            producto: { select: { nombre: true } },
          },
        },
        mesero: true,
        mesa: true,
        turno: true,
      },
    });

    if (!pedido) {
      return res.status(400).json({ msg: "Pedido inexistente!" });
    }
    if (pedido.estado === "CANCELADO" || pedido.estado === "FACTURADO") {
      return res.status(400).json({
        msg: "No se puede generar ticket de un pedido cancelado o facturado",
      });
    }
    await prisma.pedido.update({
      where: {
        id: pedido_id,
      },
      data: {
        estado: "EN_PROCESO",
      },
    });
    const fecha = new Date().toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const ticket =
      `${fecha} \n 
      ${pedido.mesero.nombre} - ${pedido.turno.id} - ${pedido.mesa.id}\n\n` +
      pedido.contenidos
        .map((contenido) => {
          return `${contenido.cantidad} x ${contenido.producto.nombre}\n`;
        })
        .join("");

    fs.writeFileSync(`ticket_${pedido_id}.txt`, ticket);

    return res
      .status(200)
      .json({ msg: "Ticket generado correctamente", ticket });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}
