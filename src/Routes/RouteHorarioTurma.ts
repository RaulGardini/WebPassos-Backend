import { Router } from "express";
import { HorariosTurmasController } from "../controllers/HorarioTurmaController";

const router = Router();

router.post("/turmas/:id/horarios", HorariosTurmasController.addHorariosToTurma);
router.delete("/turmas/:id/horarios", HorariosTurmasController.removeAllHorariosFromTurma);

export default router;