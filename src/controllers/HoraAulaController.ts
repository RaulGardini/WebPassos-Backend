import { Request, Response } from "express";
import HoraAulaService from "../Service/ServiceHoraAula";
import { ReadHoraAulaDTO } from "../DTOs/HoraAula/ReadHoraAulaDTO";

class HoraAulaController {
  static async getAllHoraAula(req: Request, res: Response): Promise<Response<ReadHoraAulaDTO[]>> {
    try {
      const horasAula = await HoraAulaService.getAllHoraAula();
      return res.json(horasAula);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async createHoraAula(req: Request, res: Response): Promise<Response<ReadHoraAulaDTO>> {
    try {
      const horaAula = await HoraAulaService.createHoraAula(req.body);
      return res.status(201).json(horaAula);
    } catch (error: any) {
      if (error.message.includes("inválid")) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteHoraAula(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      const { id } = req.params;
      const result = await HoraAulaService.deleteHoraAula(Number(id));
      return res.json(result);
    } catch (error: any) {
      if (error.message === "Hora aula não encontrada") {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}

export default HoraAulaController;