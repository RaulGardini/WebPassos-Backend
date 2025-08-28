import { Request, Response } from "express";
import ServiceHorario from "../Service/ServiceHorario";

class HorarioController {
    static async getAllHorarios(req: Request, res: Response) {
        try {
            const horarios = await ServiceHorario.getAllHorarios();
            res.json(horarios);
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar horários", error });
        }
    }

    static async getHorarioById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const horario = await ServiceHorario.getHorarioById(Number(id));
            return res.json(horario);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }

    static async createHorario(req: Request, res: Response) {
        try {
            const horario = await ServiceHorario.createHorario(req.body);
            res.status(201).json(horario);
        } catch (error) {
            res.status(500).json({ message: "Erro ao criar horário", error });
        }
    }

    static async updateHorario(req: Request, res: Response) {
        try {
            const horario = await ServiceHorario.updateHorario(
                Number(req.params.id),
                req.body
            );
            res.json(horario);
        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar horário", error });
        }
    }

    static async deleteHorario(req: Request, res: Response) {
        try {
            const result = await ServiceHorario.deleteHorario(Number(req.params.id));
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: "Erro ao deletar horário", error });
        }
    }

    static async getHorariosDisponiveisParaTurma(req: Request, res: Response) {
    try {
      const { turmaId } = req.params;
      
      if (!turmaId || isNaN(Number(turmaId))) {
        return res.status(400).json({ error: "ID da turma inválido" });
      }

      const horariosDisponiveis = await ServiceHorario.getHorariosDisponiveisParaTurma(Number(turmaId));

      return res.json(horariosDisponiveis);
    } catch (error: any) {
      console.error("Erro ao buscar horários disponíveis:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

export default HorarioController;
