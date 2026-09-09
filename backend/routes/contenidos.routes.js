import {Router} from "express";
import {
    crearContenido,
    actualizarContenido,
    eliminarContenido,
} from "../controllers/contenidos.controller.js";


const router = Router();

router.post("/", crearContenido);
router.put("/:id", actualizarContenido);
router.delete("/:id", eliminarContenido);

export default router;