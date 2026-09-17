import { Router } from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProductosPorId,
  desactivarProducto,
  actualizarProducto,
  obtenerProductosPorCategoria,
} from "../controllers/productos.controller.js";

const router = Router();

router.post("/", crearProducto);
router.get("/", obtenerProductos);
router.get("/categoria/:categoria", obtenerProductosPorCategoria);
router.get("/:id", obtenerProductosPorId);
router.put("/:id/desactivar", desactivarProducto);
router.put("/:id/actualizar", actualizarProducto);

export default router;
