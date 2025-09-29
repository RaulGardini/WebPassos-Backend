import { Router } from "express";
import { TurmasController } from "../controllers/TurmaController";

const router = Router();

router.get("/", TurmasController.getAllTurmas);
router.get("/hoje", TurmasController.getAulasHoje);
router.get("/:id", TurmasController.getTurmaById);
router.post("/", TurmasController.createTurma);
router.put("/:id", TurmasController.updateTurma);
router.delete("/:id", TurmasController.deleteTurma);
router.get("/colaborador/:colaboradorId/hoje", TurmasController.getAulasHojePorColaborador);

export default router;
