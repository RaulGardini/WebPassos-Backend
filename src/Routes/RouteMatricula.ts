import { Router } from "express";
import MatriculaController from "../Controllers/MatriculaController";

const router = Router();

// Rotas para gerenciar alunos em turmas
router.get("/turmas/:turma_id/alunos-disponiveis", MatriculaController.getAlunosDisponiveis);
router.get("/turmas/:turma_id/alunos-matriculados", MatriculaController.getAlunosMatriculados);
router.get("/turmas/:turma_id/info", MatriculaController.getTurmaInfo);
router.post("/turmas/:turma_id/matricular", MatriculaController.matricularAluno);

// Rota para desativar matrícula
router.put("/matriculas/:matricula_id/desativar", MatriculaController.desativarMatricula);

export default router;