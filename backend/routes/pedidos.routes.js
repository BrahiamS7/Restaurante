import {Router} from "express";
import {
    crearPedido,
    obtenerPedidos,
    obtenerPedidoPorId,
    actualizarEstadoPedido,
    facturarPedido,
    obtenerContenidosPorPedido,
    cancelarPedido,
    generarTicket,
} from "../controllers/pedidos.controller.js";

const router = Router();

router.post("/", crearPedido);
router.get("/", obtenerPedidos);
router.get("/:id", obtenerPedidoPorId);
router.put("/:id/estado", actualizarEstadoPedido);
router.post("/:id/facturar", facturarPedido);
router.get("/:id/contenidos", obtenerContenidosPorPedido);
router.post("/:id/cancelar", cancelarPedido);
router.post("/:id/ticket", generarTicket);

export default router;