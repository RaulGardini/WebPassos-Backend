import { Request, Response } from "express";
import ServiceCargo from "../Service/ServiceCargo";

class CargoController {
    static async getAllCargos(req: Request, res: Response) {
    try {
      const cargos = await ServiceCargo.getAllCargos();
      res.json(cargos);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar cargos", error });
    }
  }

  static async getCargoById(req: Request, res: Response) {
      try {
        const { id } = req.params;
        const cargo = await ServiceCargo.getCargoById(Number(id));
        return res.json(cargo);
      } catch (error: any) {
        return res.status(404).json({ error: error.message });
      }
    }

  static async createCargo(req: Request, res: Response) {
    try {
      const cargo = await ServiceCargo.createCargo(req.body);
      res.status(201).json(cargo);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar cargo", error });
    }
  }

  static async updateCargo(req: Request, res: Response) {
    try {
      const cargo = await ServiceCargo.updateCargo(
        Number(req.params.id),
        req.body
      );
      res.json(cargo);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar cargo", error });
    }
  }

  static async deleteCargo(req: Request, res: Response) {
    try {
      const result = await ServiceCargo.deleteCargo(Number(req.params.id));
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar cargo", error });
    }
  }
}

export default CargoController