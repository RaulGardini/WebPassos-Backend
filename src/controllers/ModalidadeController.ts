import { Request, Response } from "express";
import ServiceModalidade from "../Service/ServiceModalidade";
import { ModalidadeFilter } from "../Filter/Modalidade/ModalidadeFilter";

class ModalidadeController {
    static async getAllModalidades(req: Request, res: Response) {
    try {
      const filters: ModalidadeFilter = {
              nome_modalidade: req.query.nome_modalidade as string
            };
      
      const modalidades = await ServiceModalidade.getAllModalidades(filters);
      res.json(modalidades);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar cargos", error });
    }
  }

  static async getCargoById(req: Request, res: Response) {
      try {
        const { id } = req.params;
        const modalidade = await ServiceModalidade.getModalidadeById(Number(id));
        return res.json(modalidade);
      } catch (error: any) {
        return res.status(404).json({ error: error.message });
      }
    }

  static async createModalidade(req: Request, res: Response) {
    try {
      const modalidade = await ServiceModalidade.createModalidade(req.body);
      res.status(201).json(modalidade);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar modalidade", error });
    }
  }

  static async updateModalidade(req: Request, res: Response) {
    try {
      const modalidade = await ServiceModalidade.updateModalidade(
        Number(req.params.id),
        req.body
      );
      res.json(modalidade);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar modalidade", error });
    }
  }

  static async deleteModalidade(req: Request, res: Response) {
    try {
      const result = await ServiceModalidade.deleteModalidade(Number(req.params.id));
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar modalidade", error });
    }
  }
}

export default ModalidadeController;