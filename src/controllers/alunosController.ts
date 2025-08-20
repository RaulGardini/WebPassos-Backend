import { Request, Response } from "express";
import AlunosService from "../Service/ServiceAluno";

class AlunosController {
  // GET ALL - sem filtros
  static async getAllAlunos(req: Request, res: Response) {
    try {
      const alunos = await AlunosService.getAllAlunos();
      res.json(alunos);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar alunos", error });
    }
  }

  // GET ALL - com filtros
  static async getAllAlunosWithFilters(req: Request, res: Response) {
    try {
      const filters = req.query;
      const alunos = await AlunosService.getAllAlunosWithFilters(filters);
      res.json(alunos);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar alunos", error });
    }
  }

  // GET BY ID
  static async getAlunoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const aluno = await AlunosService.getAlunoById(parseInt(id));
      res.json(aluno);
    } catch (error: any) {
      if (error.message === "Aluno não encontrado") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Erro ao buscar aluno", error });
    }
  }

  // POST - Criar aluno
  static async createAluno(req: Request, res: Response) {
    try {
      const novoAluno = await AlunosService.createAluno(req.body);
      res.status(201).json(novoAluno);
    } catch (error: any) {
      if (error.message.includes("já cadastrado") || 
          error.message.includes("inválido")) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Erro ao criar aluno", error });
    }
  }

  // PUT - Atualizar aluno
  static async updateAluno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const alunoAtualizado = await AlunosService.updateAluno(parseInt(id), req.body);
      res.json(alunoAtualizado);
    } catch (error: any) {
      if (error.message === "Aluno não encontrado") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes("já cadastrado") || 
          error.message.includes("inválido")) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Erro ao atualizar aluno", error });
    }
  }

  // DELETE - Deletar aluno
  static async deleteAluno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = await AlunosService.deleteAluno(parseInt(id));
      res.json(resultado);
    } catch (error: any) {
      if (error.message === "Aluno não encontrado") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Erro ao deletar aluno", error });
    }
  }
}

export default AlunosController;