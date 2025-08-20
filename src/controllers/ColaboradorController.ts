import { Request, Response } from "express";
import ColaboradoresService from "../Service/ServiceColaborador";
import { ColaboradorFilter } from "../Filter/Colaborador/ColaboradorFilter";

class ColaboradoresController {
  static async getAllColaboradores(req: Request, res: Response) {
    try {
      // pega os filtros da query
      const filters: ColaboradorFilter = {
        nome: req.query.nome as string,
        email: req.query.email as string,
        cpf: req.query.cpf as string,
        sexo: req.query.sexo as "M" | "F",
        cargo_id: req.query.cargo_id ? Number(req.query.cargo_id) : undefined,
      };

      const colaboradores = await ColaboradoresService.getAllColaboradores(filters);
      return res.json(colaboradores);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getColaboradorById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const colaborador = await ColaboradoresService.getColaboradorById(Number(id));
      return res.json(colaborador);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  static async createColaborador(req: Request, res: Response) {
    try {
      const colaborador = await ColaboradoresService.createColaborador(req.body);
      return res.status(201).json(colaborador);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async updateColaborador(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const colaborador = await ColaboradoresService.updateColaborador(Number(id), req.body);
      return res.json(colaborador);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async deleteColaborador(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await ColaboradoresService.deleteColaborador(Number(id));
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default ColaboradoresController;
