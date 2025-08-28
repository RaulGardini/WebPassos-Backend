import { Request, Response } from "express";
import { TurmasService } from "../Service/ServiceTurma";
import { TurmaFilter } from "../Filter/Turma/TurmaFilter";

export class TurmasController {
  static async getAllTurmas(req: Request, res: Response) {
    try {
      const filters: TurmaFilter = {
        nome: req.query.nome as string,
        professor1_id: req.query.professor1_id ? Number(req.query.professor1_id) : undefined,
        sala_id: req.query.sala_id ? Number(req.query.sala_id) : undefined,
        status: req.query.status as "ativa" | "inativa",
        modalidade_id: req.query.modalidade_id ? Number(req.query.modalidade_id) : undefined,
      };

      const turmas = await TurmasService.getAllTurmas(filters);
      return res.json(turmas);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getTurmaById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const turma = await TurmasService.getTurmaById(Number(id));
      return res.json(turma);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  static async createTurma(req: Request, res: Response) {
    try {
      const turma = await TurmasService.createTurma(req.body);
      return res.status(201).json(turma);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async updateTurma(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const turma = await TurmasService.updateTurma(Number(id), req.body);
      return res.json(turma);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async deleteTurma(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await TurmasService.deleteTurma(Number(id));
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
