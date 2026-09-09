import {Router} from "express";
import {
    crearMesa,
    obtenerMesas,
    obtenerMesaPorId,
} from "../controllers/mesas.controller.js";



const router = Router();

router.post("/", crearMesa);
router.get("/", obtenerMesas);
router.get("/:id", obtenerMesaPorId);

export default router;