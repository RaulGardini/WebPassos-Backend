import { Request, Response } from "express";
import TempoAulaValorService from "../Service/ServiceTempoAulaValor";
import { ReadTempoAulaValorDTO } from "../DTOs/TempoAulaValor/ReadTempoAulaValor";

class TempoAulaValorController {
  static async getAllTempoAulaValor(req: Request, res: Response): Promise<Response<ReadTempoAulaValorDTO[]>> {
    try {
      const horasAula = await TempoAulaValorService.getAllTempoAulaValor();
      return res.json(horasAula);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async createTempoAulaValor(req: Request, res: Response): Promise<Response<ReadTempoAulaValorDTO>> {
    try {
      const tempoAulaValor = await TempoAulaValorService.createTempoAulaValor(req.body);
      return res.status(201).json(tempoAulaValor);
    } catch (error: any) {
      if (error.message.includes("inválid")) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteTempoAulaValor(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      const { id } = req.params;
      const result = await TempoAulaValorService.deleteTempoAulaValor(Number(id));
      return res.json(result);
    } catch (error: any) {
      if (error.message === "Hora aula não encontrada") {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}

export default TempoAulaValorController;