import { Request, Response } from "express";
import ServiceChamada from "../Service/ServiceChamada";

class ChamadaController {
    // NOVO MÉTODO: Criar chamada para hoje
    static async criarChamadaHoje(req: Request, res: Response) {
        try {
            const { turma_id } = req.params;

            if (!turma_id || isNaN(Number(turma_id))) {
                return res.status(400).json({
                    error: "ID da turma é obrigatório e deve ser um número válido"
                });
            }

            const resultado = await ServiceChamada.criarChamadaHoje(Number(turma_id));
            res.status(201).json(resultado);
        } catch (error: any) {
            res.status(400).json({
                message: "Erro ao criar chamada",
                error: error.message
            });
        }
    }

    static async gerarChamadasMes(req: Request, res: Response) {
        try {
            const { colaborador_id } = req.params;

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

    static async getChamadasDoMes(req: Request, res: Response) {
        try {
            const { colaborador_id } = req.params;
            const { mes } = req.query as { mes?: string };

            if (!colaborador_id) {
                return res.status(400).json({
                    error: "colaborador_id é obrigatório"
                });
            }

            const resultado = await ServiceChamada.getChamadasDoMes(Number(colaborador_id), mes);
            res.json(resultado);
        } catch (error: any) {
            res.status(500).json({
                message: "Erro ao buscar chamadas do mês",
                error: error.message
            });
        }
    }
}

export default ChamadaController;