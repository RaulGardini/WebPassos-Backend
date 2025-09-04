import { Request, Response } from "express";
import ServiceFornecedor from "../Service/ServiceFornecedor";
import { FornecedorFilter } from "../Filter/Fornecedor/FornecedorFilter";

class FornecedorController {
    static async getAllFornecedores(req: Request, res: Response) {
    try {
      const filters: FornecedorFilter = {
              nome: req.query.nome as string,
              email: req.query.email as string,
              telefone: req.query.telefone as string
            };
      
      const fornecedor = await ServiceFornecedor.getAllFornecedores(filters);
      res.json(fornecedor);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar fornecedor", error });
    }
  }

  static async getFornecedorById(req: Request, res: Response) {
      try {
        const { id } = req.params;
        const fornecedor = await ServiceFornecedor.getFornecedorById(Number(id));
        return res.json(fornecedor);
      } catch (error: any) {
        return res.status(404).json({ error: error.message });
      }
    }

  static async createFornecedor(req: Request, res: Response) {
    try {
      const fornecedor = await ServiceFornecedor.createFornecedor(req.body);
      res.status(201).json(fornecedor);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar fornecedor", error });
    }
  }

  static async updateFornecedor(req: Request, res: Response) {
    try {
      const fornecedor = await ServiceFornecedor.updateFornecedor(
        Number(req.params.id),
        req.body
      );
      res.json(fornecedor);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar fornecedor", error });
    }
  }

  static async deleteFornecedor(req: Request, res: Response) {
    try {
      const result = await ServiceFornecedor.deleteFornecedor(Number(req.params.id));
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar fornecedor", error });
    }
  }
}

export default FornecedorController