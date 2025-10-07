import { Request, Response } from "express";
import FolhaPagamentoService from "../Service/ServiceFolhaPagamento";
import { FolhaPagamentoFilter } from "../Filter/FolhaPagamento/FolhaPagamentoFilter";
import { ReadFolhaPagamentoDTO } from "../DTOs/FolhaPagamento/ReadFolhaPagamentoDTO";

class FolhaPagamentoController {
  static async getFolhaPagamento(req: Request, res: Response): Promise<Response<ReadFolhaPagamentoDTO[]>> {
    try {
      const filters: FolhaPagamentoFilter = {
        nome: req.query.nome as string,
        cargo_id: req.query.cargo_id ? parseInt(req.query.cargo_id as string) : undefined,
        mes: req.query.mes ? parseInt(req.query.mes as string) : undefined
      };

      // Remove propriedades vazias do filtro
      Object.keys(filters).forEach(key => {
        if (!filters[key as keyof FolhaPagamentoFilter]) {
          delete filters[key as keyof FolhaPagamentoFilter];
        }
      });

      const resultado = await FolhaPagamentoService.getFolhaPagamento(filters);
      return res.json(resultado);
    } catch (error: any) {
      if (error.message.includes("inválido")) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}

export default FolhaPagamentoController;