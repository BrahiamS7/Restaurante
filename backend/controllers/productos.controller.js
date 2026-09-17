import prisma from "../utils/prisma.js";

const CATEGORIAS_VALIDAS = ["PLATO_FUERTE", "ENTRADA", "BEBIDA", "POSTRE", "OTRO"];

// PRODUCTOS
export async function crearProducto(req, res) {
  try {
    const { nombre, precio, categoria } = req.body;
    if (!nombre || precio === undefined || precio === null || !categoria) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
    if (typeof nombre !== "string" || nombre.trim().length === 0) {
      return res.status(400).json({ msg: "Formato de nombre invalido!" });
    }
    if (
      typeof precio !== "number" ||
      !Number.isFinite(precio) ||
      precio <= 0
    ) {
      return res.status(400).json({ msg: "Formato de precio invalido!" });
    }
    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
      return res.status(400).json({ msg: "Categoria invalida!" });
    }
    const producto = await prisma.producto.create({
      data: {
        nombre,
        precio,
        categoria,
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

export async function obtenerProductosPorCategoria(req, res) {
  try {
    const categoria = req.params.categoria;
    const productos = await prisma.producto.findMany({
      where: {
        categoria,
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
    const { nombre, precio, categoria } = req.body;
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
    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
      return res.status(400).json({ msg: "Categoria invalida!" });
    }
    if (
      typeof precio !== "number" ||
      !Number.isFinite(precio) ||
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
        categoria,
      },
    });
    return res
      .status(200)
      .json({ msg: "Producto actualizado correctamente", productoActualizado });
  } catch (error) {
    return res.status(500).json({ msg: error.message, error });
  }
}
