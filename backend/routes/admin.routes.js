import {Router} from "express";
import {
    login,
    crearMesero,
    obtenerMeseros,
    obtenerMeseroPorId,
    actualizarMesero,
    desactivarMesero,
} from "../controllers/admin.controller.js";

const router = Router();

router.post("/login", login);
router.post("/mesero", crearMesero);
router.get("/meseros", obtenerMeseros);
router.get("/mesero/:id", obtenerMeseroPorId);
router.put("/mesero/:id", actualizarMesero);
router.delete("/mesero/:id", desactivarMesero);

export default router;