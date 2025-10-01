import { Router } from "express";
import MatriculaController from "../controllers/MatriculaController";

const router = Router();

router.get("/turmas/:turma_id/alunos-disponiveis", MatriculaController.getAlunosDisponiveis);
router.get("/turmas/:turma_id/alunos-matriculados", MatriculaController.getAlunosMatriculados);
router.get("/turmas/:turma_id/info", MatriculaController.getTurmaInfo);
router.post("/turmas/:turma_id/matricular", MatriculaController.matricularAluno);
router.get("/alunos/:aluno_id/turmas-matriculadas", MatriculaController.getTurmasDoAluno);
router.get("/alunos/:aluno_id/turmas-disponiveis", MatriculaController.getTurmasDisponiveis);
router.post("/alunos/:aluno_id/matricular/:turma_id", MatriculaController.matricularAlunoNaTurma);
router.delete("/:matricula_id", MatriculaController.deletarMatricula);

export default router;