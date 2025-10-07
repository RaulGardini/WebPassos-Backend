import { Request, Response } from "express";
import HoraAulaProfSecService from "../Service/ServiceHoraAulaProfSec";
import { ReadHoraAulaProfSecDTO } from "../DTOs/HoraAulaProfSec/ReadHoraAulaProfSecDTO";

class HoraAulaController {
  static async getAllHoraAulaProfSec(req: Request, res: Response): Promise<Response<ReadHoraAulaProfSecDTO[]>> {
    try {
      const horasAulaProfSec = await HoraAulaProfSecService.getAllHoraAulaProfSec();
      return res.json(horasAulaProfSec);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async createHoraAulaProfSec(req: Request, res: Response): Promise<Response<ReadHoraAulaProfSecDTO>> {
    try {
      const horaAulaProfSec = await HoraAulaProfSecService.createHoraAulaProfSec(req.body);
      return res.status(201).json(horaAulaProfSec);
    } catch (error: any) {
      if (error.message.includes("inválid")) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteHoraAulaProfSec(req: Request, res: Response): Promise<Response<{ message: string }>> {
    try {
      const { id } = req.params;
      const result = await HoraAulaProfSecService.deleteHoraAulaProfSec(Number(id));
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