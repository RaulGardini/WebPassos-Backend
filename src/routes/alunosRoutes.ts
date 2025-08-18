import { Router } from "express";
import AlunosController from "../controllers/alunosController";

const router = Router();

router.get("/", AlunosController.getAllAlunos);
router.get("/filter", AlunosController.getAllAlunosWithFilters);
router.get("/:id", AlunosController.getAlunoById);
router.post("/", AlunosController.createAluno);
router.put("/:id", AlunosController.updateAluno);
router.delete("/:id", AlunosController.deleteAluno);

export default router;