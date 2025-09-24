import { Request, Response } from "express";
import ServiceChamada from "../Service/ServiceChamada";

class ChamadaController {
    static async gerarChamadasMes(req: Request, res: Response) {
        try {
            const { colaborador_id } = req.params; // Mudança: pegar do params em vez do body

            if (!colaborador_id) {
                return res.status(400).json({
                    error: "colaborador_id é obrigatório"
                });
            }

            const resultado = await ServiceChamada.gerarChamadasMes({
                colaborador_id: Number(colaborador_id)
            });
            res.status(201).json(resultado);
        } catch (error: any) {
            res.status(400).json({
                message: "Erro ao gerar chamadas",
                error: error.message
            });
        }
    }

    static async getChamadasDoDia(req: Request, res: Response) {
        try {
            const { colaborador_id } = req.params;

            const resultado = await ServiceChamada.getChamadasDoDia(Number(colaborador_id));
            res.json(resultado);
        } catch (error: any) {
            res.status(500).json({
                message: "Erro ao buscar chamadas do dia",
                error: error.message
            });
        }
    }
}

export default ChamadaController;