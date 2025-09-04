import { Request, Response } from "express";
import { ServiceDashboard } from "../Service/ServiceDashboard";

export class DashboardController {
    static async getInfoEscola(req: Request, res: Response) {
        try {
            const ocupacao = await ServiceDashboard.getInfoEscola();

            return res.status(200).json({
                success: true,
                data: ocupacao,
                message: "Ocupação calculada com sucesso"
            });

        } catch (error: any) {
            console.error('Erro ao buscar ocupação das turmas:', error);

            return res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                details: error.message
            });
        }
    }
}