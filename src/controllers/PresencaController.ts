import { Request, Response } from "express";
import ServicePresenca from "../Service/ServicePresenca";

class PresencaController {
    static async criarPresencas(req: Request, res: Response) {
        try {
            const { chamada_id } = req.params;

            if (!chamada_id || isNaN(Number(chamada_id))) {
                return res.status(400).json({
                    error: "ID da chamada é obrigatório e deve ser um número válido"
                });
            }

            const resultado = await ServicePresenca.criarPresencas(Number(chamada_id));
            res.status(201).json(resultado);
        } catch (error: any) {
            res.status(400).json({
                message: "Erro ao criar presenças",
                error: error.message
            });
        }
    }

    static async atualizarStatus(req: Request, res: Response) {
        try {
            const { presenca_id } = req.params;
            const { status } = req.body;

            if (!presenca_id || isNaN(Number(presenca_id))) {
                return res.status(400).json({
                    error: "ID da presença é obrigatório e deve ser um número válido"
                });
            }

            if (!status) {
                return res.status(400).json({
                    error: "Status é obrigatório"
                });
            }

            const resultado = await ServicePresenca.atualizarStatus(Number(presenca_id), status);
            res.status(200).json(resultado);
        } catch (error: any) {
            res.status(400).json({
                message: "Erro ao atualizar status",
                error: error.message
            });
        }
    }

    static async listarPresencas(req: Request, res: Response) {
        try {
            const { chamada_id } = req.params;

            if (!chamada_id || isNaN(Number(chamada_id))) {
                return res.status(400).json({
                    error: "ID da chamada é obrigatório e deve ser um número válido"
                });
            }

            const resultado = await ServicePresenca.listarPresencas(Number(chamada_id));
            res.status(200).json(resultado);
        } catch (error: any) {
            res.status(400).json({
                message: "Erro ao listar presenças",
                error: error.message
            });
        }
    }
}

export default PresencaController;