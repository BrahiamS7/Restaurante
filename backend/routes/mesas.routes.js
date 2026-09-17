import {Router} from "express";
import {
    crearMesa,
    obtenerMesas,
    obtenerMesaPorId,
    desactivarMesa,
    reactivarMesa
} from "../controllers/mesas.controller.js";



const router = Router();

router.post("/", crearMesa);
router.get("/", obtenerMesas);
router.get("/:id", obtenerMesaPorId);
router.put("/:id/desactivar", desactivarMesa);
router.put("/:id/reactivar", reactivarMesa);

export default router;