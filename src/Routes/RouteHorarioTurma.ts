import { Router } from "express";
import { HorariosTurmasController } from "../Controllers/HorarioTurmaController";

const router = Router();

// Rotas principais solicitadas
router.post("/turmas/:id/horarios", HorariosTurmasController.addHorariosToTurma);
router.get("/turmas/:id/horarios", HorariosTurmasController.getHorariosByTurma);
router.delete("/turmas/:id/horarios/:hid", HorariosTurmasController.removeHorarioFromTurma);

// Rotas extras para CRUD completo (opcional)
router.get("/horarios-turmas", HorariosTurmasController.getAllHorariosTurmas);
router.get("/horarios-turmas/:id", HorariosTurmasController.getHorarioTurmaById);
router.delete("/turmas/:id/horarios", HorariosTurmasController.removeAllHorariosFromTurma);

export default router;