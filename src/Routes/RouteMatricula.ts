import { Router } from "express";
import MatriculaController from "../controllers/MatriculaController";

const router = Router();

// Rotas de turmas (específicas primeiro)
router.get("/turmas/:turma_id/alunos-disponiveis", MatriculaController.getAlunosDisponiveis);
router.get("/turmas/:turma_id/alunos-matriculados", MatriculaController.getAlunosMatriculados);
router.get("/turmas/:turma_id/info", MatriculaController.getTurmaInfo);
router.post("/turmas/:turma_id/matricular", MatriculaController.matricularAluno);

// Rotas de alunos (específicas)
router.get("/alunos/:aluno_id/turmas-matriculadas", MatriculaController.getTurmasDoAluno);
router.get("/alunos/:aluno_id/turmas-disponiveis", MatriculaController.getTurmasDisponiveis);
router.get("/alunos/:aluno_id/matriculas", MatriculaController.getAll); // ⬅️ MUDANÇA AQUI
router.post("/alunos/:aluno_id/matricular/:turma_id", MatriculaController.matricularAlunoNaTurma);

// Rotas genéricas por ID (no final!)
router.put("/detalhes/:matricula_id", MatriculaController.updateMatricula); // ⬅️ MUDANÇA AQUI
router.delete("/detalhes/:matricula_id", MatriculaController.deletarMatricula); // ⬅️ MUDANÇA AQUI

export default router;