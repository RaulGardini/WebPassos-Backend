import { Request, Response } from "express";
import ServiceSala from "../Service/ServiceSala";
import { SalaFilter } from "../Filter/Sala/SalaFilter";

class SalaController {
    static async getAllSalas(req: Request, res: Response) {
    try {
      const filters: SalaFilter = {
              nome_sala: req.query.nome_sala as string
            };
      
      const salas = await ServiceSala.getAllSalas(filters);
      res.json(salas);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar salas", error });
    }
  }

  static async getSalaById(req: Request, res: Response) {
      try {
        const { id } = req.params;
        const sala = await ServiceSala.getSalaById(Number(id));
        return res.json(sala);
      } catch (error: any) {
        return res.status(404).json({ error: error.message });
      }
    }

  static async createSala(req: Request, res: Response) {
    try {
      const sala = await ServiceSala.createSala(req.body);
      res.status(201).json(sala);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar sala", error });
    }
  }

  static async updateSala(req: Request, res: Response) {
    try {
      const sala = await ServiceSala.updateSala(
        Number(req.params.id),
        req.body
      );
      res.json(sala);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar sala", error });
    }
  }

  static async deleteSala(req: Request, res: Response) {
    try {
      const result = await ServiceSala.deleteSala(Number(req.params.id));
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar sala", error });
    }
  }
}

export default SalaController;