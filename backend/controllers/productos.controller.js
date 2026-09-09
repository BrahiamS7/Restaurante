import prisma from "../utils/prisma.js";


// PRODUCTOS
export async function crearProducto(req, res) {
  try {
    const { nombre, precio } = req.body;
    if (!nombre || !precio) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
    if (typeof nombre !== "string" || nombre.trim().length === 0) {
      return res.status(400).json({ msg: "Formato de nombre invalido!" });
    }
    if (
      typeof precio !== "number" ||
      !Number.isInteger(precio) ||
      precio <= 0
    ) {
      return res.status(400).json({ msg: "Formato de precio invalido!" });
    }
    const producto = await prisma.producto.create({
      data: {
        nombre,
        precio,
      },
    });
    return res.status(201).json(producto);
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function obtenerProductos(req, res) {
  try {
    const productos = await prisma.producto.findMany({
      where: {
        activo: true,
      },
    });
    if (productos.length === 0) {
      return res.status(400).json({ msg: "No hay productos que mostrar!" });
    }
    return res
      .status(200)
      .json({ msg: "Productos cargados correctamente", productos });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function obtenerProductosPorId(req, res) {
  try {
    const producto_id = Number(req.params.id);
    if (
      typeof producto_id !== "number" ||
      !Number.isInteger(producto_id) ||
      producto_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de producto invalido!" });
    }
    const producto = await prisma.producto.findUnique({
      where: {
        id: producto_id,
      },
    });
    if (!producto) {
      return res.status(400).json({ msg: "Producto no encontrado" });
    }
    return res
      .status(200)
      .json({ msg: "Producto cargado correctamente", producto });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function desactivarProducto(req, res) {
  try {
    const producto_id = Number(req.params.id);
    if (
      typeof producto_id !== "number" ||
      !Number.isInteger(producto_id) ||
      producto_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de producto invalido!" });
    }
    const productoActualizado = await prisma.producto.update({
      where: {
        id: producto_id,
      },
      data: {
        activo: false,
      },
    });
    return res
      .status(200)
      .json({ msg: "Producto actualizado correctamente", productoActualizado });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}

export async function actualizarProducto(req, res) {
  try {
    const producto_id = Number(req.params.id);
    const { nombre, precio } = req.body;
    if (
      typeof producto_id !== "number" ||
      !Number.isInteger(producto_id) ||
      producto_id <= 0
    ) {
      return res.status(400).json({ msg: "Codigo de producto invalido!" });
    }
    if (typeof nombre !== "string" || nombre.trim().length === 0) {
      return res.status(400).json({ msg: "Formato de nombre invalido!" });
    }
    if (
      typeof precio !== "number" ||
      !Number.isInteger(precio) ||
      precio <= 0
    ) {
      return res.status(400).json({ msg: "Formato de precio invalido!" });
    }
    const productoActualizado = await prisma.producto.update({
      where: {
        id: producto_id,
      },
      data: {
        nombre,
        precio,
      },
    });
    return res
      .status(200)
      .json({ msg: "Producto actualizado correctamente", productoActualizado });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}