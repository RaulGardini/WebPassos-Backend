import { Router } from "express";
import MatriculaController from "../Controllers/MatriculaController";

const router = Router();

router.get("/turmas/:turma_id/alunos-disponiveis", MatriculaController.getAlunosDisponiveis);
router.get("/turmas/:turma_id/alunos-matriculados", MatriculaController.getAlunosMatriculados);
router.get("/turmas/:turma_id/info", MatriculaController.getTurmaInfo);
router.post("/turmas/:turma_id/matricular", MatriculaController.matricularAluno);
router.delete("/:matricula_id", MatriculaController.deletarMatricula);

export default router;