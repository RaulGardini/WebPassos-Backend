import { Request, Response } from "express";
import AlunosService from "../Service/ServiceAluno";
import { AlunoFilter } from "../Filter/Aluno/AlunoFilter";
import { PaginationOptions } from "../Pagination/Pagination";

class AlunosController {
  static async getAllAlunos(req: Request, res: Response) {
      // Pega os filtros da query
      const filters: AlunoFilter = {
        nome: req.query.nome as string,
        email: req.query.email as string,
        cpf: req.query.cpf as string,
        telefone: req.query.telefone as string,
        sexo: req.query.sexo as "M" | "F",
        cidade: req.query.cidade as string,
        responsavel_financeiro: req.query.responsavel_financeiro as string,
      };

      // Remove propriedades vazias do filtro
      Object.keys(filters).forEach(key => {
        if (!filters[key as keyof AlunoFilter]) {
          delete filters[key as keyof AlunoFilter];
        }
      });

      // Pega os parâmetros de paginação
      const pagination: PaginationOptions | undefined = req.query.page || req.query.limit ? {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10
      } : undefined;

      const result = await AlunosService.getAllAlunos(
        Object.keys(filters).length > 0 ? filters : undefined, 
        pagination
      );

      return res.json(result);
  }

  static async getAlunoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const aluno = await AlunosService.getAlunoById(Number(id));
      return res.json(aluno);
    } catch (error: any) {
      if (error.message === "Aluno não encontrado") {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  static async createAluno(req: Request, res: Response) {
    try {
      const aluno = await AlunosService.createAluno(req.body);
      return res.status(201).json(aluno);
    } catch (error: any) {
      if (error.message.includes("já cadastrado") ||
          error.message.includes("inválido")) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateAluno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const aluno = await AlunosService.updateAluno(Number(id), req.body);
      return res.json(aluno);
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

  static async deleteAluno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await AlunosService.deleteAluno(Number(id));
      return res.json(result);
    } catch (error: any) {
      if (error.message === "Aluno não encontrado") {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}

export default AlunosController;