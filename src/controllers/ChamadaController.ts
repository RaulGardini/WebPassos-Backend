import { Request, Response } from "express";
import ServiceChamada from "../Service/ServiceChamada";

class ChamadaController {
    static async criarChamadaHoje(req: Request, res: Response) {
        try {
            const { turma_id } = req.params;

            if (!turma_id || isNaN(Number(turma_id))) {
                return res.status(400).json({
                    error: "ID da turma inválido"
                });
            }

            const resultado = await ServiceChamada.criarChamadaHoje(Number(turma_id));
            return res.status(201).json(resultado);
        } catch (error: any) {
            return res.status(400).json({
                error: error.message
            });
        }
    }

    static async gerarChamadasMes(req: Request, res: Response) {
        try {
            const { colaborador_id } = req.params;

            if (!colaborador_id || isNaN(Number(colaborador_id))) {
                return res.status(400).json({
                    error: "ID do colaborador inválido"
                });
            }

            const resultado = await ServiceChamada.gerarChamadasMes({
                colaborador_id: Number(colaborador_id)
            });
            return res.status(201).json(resultado);
        } catch (error: any) {
            return res.status(400).json({
                error: error.message
            });
        }
    }

    static async getChamadasDoDia(req: Request, res: Response) {
        try {
            const { colaborador_id } = req.params;

            if (!colaborador_id || isNaN(Number(colaborador_id))) {
                return res.status(400).json({
                    error: "ID do colaborador inválido"
                });
            }

            const resultado = await ServiceChamada.getChamadasDoDia(Number(colaborador_id));
            return res.json(resultado);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    static async getChamadasDoMes(req: Request, res: Response) {
        try {
            const { colaborador_id } = req.params;
            const { mes } = req.query as { mes?: string };

            if (!colaborador_id || isNaN(Number(colaborador_id))) {
                return res.status(400).json({
                    error: "ID do colaborador inválido"
                });
            }

            const resultado = await ServiceChamada.getChamadasDoMes(Number(colaborador_id), mes);
            return res.json(resultado);
        } catch (error: any) {
            return res.status(500).json({
                error: error.message
            });
        }
    }
}

export default ChamadaController;