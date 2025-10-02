import { Request, Response } from "express";
import ServiceMatriculasMov from "../Service/ServiceMatriculasMov";

class MatriculasMovController {
    static async getContagemMovimentacoes(req: Request, res: Response) {
        try {
            const contagem = await ServiceMatriculasMov.getContagemMovimentacoes();
            
            res.json(contagem); // Retorna direto sem wrapper
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: "Erro ao buscar contagem de movimentações",
                error: error.message
            });
        }
    }
}

export default MatriculasMovController;