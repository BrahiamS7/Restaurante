import {Router} from "express";
import {
    crearMesero,
    obtenerMeseros,
    obtenerMeseroPorId,
    actualizarMesero,
    desactivarMesero,
    reactivarMesero,
} from "../controllers/admin.controller.js";

const router = Router();

router.post("/mesero", crearMesero);
router.get("/meseros", obtenerMeseros);
router.get("/mesero/:id", obtenerMeseroPorId);
router.put("/mesero/:id", actualizarMesero);
router.put("/mesero/:id/desactivar", desactivarMesero);
router.put("/mesero/:id/reactivar", reactivarMesero);

export default router;