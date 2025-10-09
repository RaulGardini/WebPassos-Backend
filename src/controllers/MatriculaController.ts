import { Request, Response } from "express";
import ServiceMatricula from "../Service/ServiceMatricula";

class MatriculaController {
  // GET /turmas/:turma_id/alunos-disponiveis
  static async getAlunosDisponiveis(req: Request, res: Response) {
    try {
      const { turma_id } = req.params;
      const filter = req.query;
      
      const alunos = await ServiceMatricula.getAlunosDisponiveis(
        parseInt(turma_id), 
        filter
      );
      
      res.json({
        success: true,
        data: alunos
      });
    } catch (error: any) {
      if (error.message === "Turma não encontrada") {
        return res.status(404).json({ 
          success: false,
          message: error.message 
        });
      }
      res.status(500).json({ 
        success: false,
        message: "Erro ao buscar alunos disponíveis", 
        error: error.message 
      });
    }
  }

  static async getAll(req: Request, res: Response) {
    const { aluno_id } = req.params;
    const alunoId = parseInt(aluno_id);
    const matriculas = await ServiceMatricula.getAll(alunoId);
    
    return res.status(200).json(matriculas);
}

static async updateMatricula(req: Request, res: Response) {
  try {
    const { matricula_id } = req.params; // <-- nome correto
    const affectedRows = await ServiceMatricula.updateMatricula(Number(matricula_id), req.body);
    return res.json({ updated: affectedRows });
  } catch (error: any) {
    if (error.message === "Aluno não encontrado") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes("já cadastrado") ||
        error.message.includes("inválido")) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
}

  // GET /turmas/:turma_id/alunos-matriculados
  static async getAlunosMatriculados(req: Request, res: Response) {
    try {
      const { turma_id } = req.params;
      const filter = req.query;
      
      const matriculas = await ServiceMatricula.getAlunosMatriculados(
        parseInt(turma_id), 
        filter
      );
      
      res.json({
        success: true,
        data: matriculas
      });
    } catch (error: any) {
      if (error.message === "Turma não encontrada") {
        return res.status(404).json({ 
          success: false,
          message: error.message 
        });
      }
      res.status(500).json({ 
        success: false,
        message: "Erro ao buscar alunos matriculados", 
        error: error.message 
      });
    }
  }

  // NOVOS ENDPOINTS PARA TURMAS POR ALUNO
  // GET /alunos/:aluno_id/turmas-matriculadas
  static async getTurmasDoAluno(req: Request, res: Response) {
    try {
      const { aluno_id } = req.params;
      
      const turmas = await ServiceMatricula.getTurmasDoAluno(parseInt(aluno_id));
      
      res.json({
        success: true,
        data: turmas,
        total: turmas.length
      });
    } catch (error: any) {
      if (error.message === "Aluno não encontrado") {
        return res.status(404).json({ 
          success: false,
          message: error.message 
        });
      }
      res.status(500).json({ 
        success: false,
        message: "Erro ao buscar turmas do aluno", 
        error: error.message 
      });
    }
  }

  // GET /alunos/:aluno_id/turmas-disponiveis
  static async getTurmasDisponiveis(req: Request, res: Response) {
    try {
      const { aluno_id } = req.params;
      
      const turmas = await ServiceMatricula.getTurmasDisponiveis(parseInt(aluno_id));
      
      res.json({
        success: true,
        data: turmas,
        total: turmas.length
      });
    } catch (error: any) {
      if (error.message === "Aluno não encontrado") {
        return res.status(404).json({ 
          success: false,
          message: error.message 
        });
      }
      res.status(500).json({ 
        success: false,
        message: "Erro ao buscar turmas disponíveis", 
        error: error.message 
      });
    }
  }

  // POST /alunos/:aluno_id/matricular/:turma_id
  static async matricularAlunoNaTurma(req: Request, res: Response) {
    try {
      const { aluno_id, turma_id } = req.params;

      const matricula = await ServiceMatricula.matricularAlunoNaTurma(
        parseInt(aluno_id),
        parseInt(turma_id)
      );

      res.status(201).json({
        success: true,
        message: "Aluno matriculado com sucesso na turma",
        data: matricula
      });
    } catch (error: any) {
      if (error.message === "Turma não encontrada" || 
          error.message === "Aluno não encontrado") {
        return res.status(404).json({ 
          success: false,
          message: error.message 
        });
      }
      if (error.message.includes("já está matriculado") || 
          error.message.includes("capacidade máxima")) {
        return res.status(400).json({ 
          success: false,
          message: error.message 
        });
      }
      res.status(500).json({ 
        success: false,
        message: "Erro ao matricular aluno na turma", 
        error: error.message 
      });
    }
  }

  // POST /turmas/:turma_id/matricular (método original)
  static async matricularAluno(req: Request, res: Response) {
    try {
      const { turma_id } = req.params;
      const { aluno_id } = req.body;

      if (!aluno_id) {
        return res.status(400).json({
          success: false,
          message: "aluno_id é obrigatório"
        });
      }

      const matricula = await ServiceMatricula.matricularAluno({
        aluno_id: parseInt(aluno_id),
        turma_id: parseInt(turma_id)
      });

      res.status(201).json({
        success: true,
        message: "Aluno matriculado com sucesso",
        data: matricula
      });
    } catch (error: any) {
      if (error.message === "Turma não encontrada" || 
          error.message === "Aluno não encontrado") {
        return res.status(404).json({ 
          success: false,
          message: error.message 
        });
      }
      if (error.message.includes("já está matriculado") || 
          error.message.includes("capacidade máxima")) {
        return res.status(400).json({ 
          success: false,
          message: error.message 
        });
      }
      res.status(500).json({ 
        success: false,
        message: "Erro ao matricular aluno", 
        error: error.message 
      });
    }
  }

  // DELETE /matriculas/:matricula_id
  static async deletarMatricula(req: Request, res: Response) {
    try {
      const { matricula_id } = req.params;
      
      const resultado = await ServiceMatricula.deletarMatricula(parseInt(matricula_id));
      
      res.json({
        success: true,
        ...resultado
      });
    } catch (error: any) {
      if (error.message === "Matrícula não encontrada") {
        return res.status(404).json({ 
          success: false,
          message: error.message 
        });
      }
      res.status(500).json({ 
        success: false,
        message: "Erro ao deletar matrícula", 
        error: error.message 
      });
    }
  }

  // GET /turmas/:turma_id/info
  static async getTurmaInfo(req: Request, res: Response) {
    try {
      const { turma_id } = req.params;
      
      const turmaInfo = await ServiceMatricula.getTurmaInfo(parseInt(turma_id));
      
      res.json({
        success: true,
        data: turmaInfo
      });
    } catch (error: any) {
      if (error.message === "Turma não encontrada") {
        return res.status(404).json({ 
          success: false,
          message: error.message 
        });
      }
      res.status(500).json({ 
        success: false,
        message: "Erro ao buscar informações da turma", 
        error: error.message 
      });
    }
  }
}

export default MatriculaController;