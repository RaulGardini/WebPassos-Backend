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

  static async getAulasHoje(req: Request, res: Response) {
    try {
      const aulas = await TurmasService.getAulasHoje();
      
      // Formatando a resposta para melhor legibilidade
      const aulasFormatadas = aulas.map((turma: any) => ({
        turma_id: turma.turma_id,
        nome_turma: turma.nome,
        sala_id: turma.sala_id,
        modalidade_id: turma.modalidade_id,
        professor1_id: turma.professor1_id,
        professor2_id: turma.professor2_id,
        capacidade: turma.capacidade,
        horarios: turma.horarios ? turma.horarios.map((h: any) => ({
          horario_id: h.horario_id,
          dia_semana: h.dia_semana,
          horario: h.horario
        })) : []
      }));

      return res.json({
        data: new Date().toLocaleDateString('pt-BR'),
        total_aulas: aulasFormatadas.length,
        aulas: aulasFormatadas
      });
    } catch (error: any) {
      console.error('Erro ao buscar aulas de hoje:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor',
        details: error.message 
      });
    }
  }
}
