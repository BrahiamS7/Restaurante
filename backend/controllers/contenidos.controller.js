import prisma from "../utils/prisma.js";

export async function crearContenido(req, res) {
  try {
    const { cantidad, producto_id, pedido_id } = req.body;

    if (
      typeof cantidad !== "number" ||
      !Number.isInteger(cantidad) ||
      cantidad <= 0
    ) {
      return res.status(400).json({ msg: "Cantidad invalida!" });
    }
    if (
      typeof pedido_id !== "number" ||
      !Number.isInteger(pedido_id) ||
      pedido_id <= 0
    ) {
      return res.status(400).json({ msg: "Pedido invalido!" });
    }
    if (
      typeof producto_id !== "number" ||
      !Number.isInteger(producto_id) ||
      producto_id <= 0
    ) {
      return res.status(400).json({ msg: "Producto invalido!" });
    }

    const producto = await prisma.producto.findUnique({
      where: {
        id: Number(producto_id),
      },
    });
    if (!producto) {
      return res.status(400).json({ msg: "Producto inexistente!" });
    }
    const pedido = await prisma.pedido.findUnique({
      where: {
        id: Number(pedido_id),
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

    const precio = producto.precio.times(cantidad);
    const contenido = await prisma.contenido.create({
      data: {
        cantidad,
        precio,
        producto_id: Number(producto_id),
        pedido_id: Number(pedido_id),
      },
    });
    res.status(201).json({ msg: "contenido creado correctamente", contenido });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function actualizarContenido(req, res) {
  try {
    const contenido_id = Number(req.params.id);
    const { cantidad, observaciones } = req.body;

    if (
      typeof contenido_id !== "number" ||
      !Number.isInteger(contenido_id) ||
      contenido_id <= 0
    ) {
      return res.status(400).json({ msg: "Contenido invalido!" });
    }
    if (
      typeof cantidad !== "number" ||
      !Number.isInteger(cantidad) ||
      cantidad <= 0
    ) {
      return res.status(400).json({ msg: "Cantidad invalida!" });
    }

    const contenidoExistente = await prisma.contenido.findUnique({
      where: { id: contenido_id },
      include: {
        producto: { select: { precio: true } },
        pedido: { select: { estado: true } },
      },
    });

    if (!contenidoExistente) {
      return res.status(404).json({ msg: "Contenido inexistente!" });
    }
    if (
      contenidoExistente.pedido.estado === "CANCELADO" ||
      contenidoExistente.pedido.estado === "FACTURADO"
    ) {
      return res.status(400).json({
        msg: "No se puede actualizar un contenido de un pedido cancelado o facturado",
      });
    }

    const nuevoPrecio = contenidoExistente.producto.precio.times(cantidad);

    const contenidoAct = await prisma.contenido.update({
      where: { id: contenido_id },
      data: {
        cantidad,
        observaciones,
        precio: nuevoPrecio,
      },
    });

    return res
      .status(200)
      .json({ msg: "Contenido actualizado correctamente", contenidoAct });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function eliminarContenido(req, res) {
  try {
    const contenido_id = Number(req.params.id);
    if (
      typeof contenido_id !== "number" ||
      !Number.isInteger(contenido_id) ||
      contenido_id <= 0
    ) {
      return res.status(400).json({ msg: "Contenido invalido!" });
    }
    const contenidoExistente = await prisma.contenido.findUnique({
      where: { id: contenido_id },
      include: {
        pedido: { select: { estado: true } },
      },
    });
    if (!contenidoExistente) {
      return res.status(404).json({ msg: "Contenido inexistente!" });
    }
    if (
      contenidoExistente.pedido.estado === "CANCELADO" ||
      contenidoExistente.pedido.estado === "FACTURADO"
    ) {
      return res.status(400).json({
        msg: "No se puede eliminar un contenido de un pedido cancelado o facturado",
      });
    }
    await prisma.contenido.delete({
      where: { id: contenido_id },
    });
    return res.status(200).json({ msg: "Contenido eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}
