import { Router } from "express";
import {
  crearTurno,
  obtenerTurnos,
  obtenerTurnoPorId,
  turnoActual,
  cerrarTurno,
} from "../controllers/turnos.controller.js";


const router = Router();

router.post("/", crearTurno);
router.get("/", obtenerTurnos);
router.get("/actual", turnoActual);
router.post("/:id/cerrar", cerrarTurno);
router.get("/:id", obtenerTurnoPorId);

export default router;