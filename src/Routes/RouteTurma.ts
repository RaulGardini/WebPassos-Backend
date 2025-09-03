import { Router } from "express";
import { TurmasController } from "../Controllers/TurmaController";

const router = Router();

router.get("/", TurmasController.getAllTurmas);
router.get("/hoje", TurmasController.getAulasHoje);
router.get("/:id", TurmasController.getTurmaById);
router.post("/", TurmasController.createTurma);
router.put("/:id", TurmasController.updateTurma);
router.delete("/:id", TurmasController.deleteTurma);

export default router;
