import { Op } from "sequelize";
import MatriculaMov from "../Models/MatriculaMov";

class RepositoryMatriculasMov {
    static async countByTipo(tipo: string) {
        // Pega o mês e ano atual automaticamente
        const dataAtual = new Date();
        const mes = dataAtual.getMonth(); // 0-11
        const ano = dataAtual.getFullYear();
        
        // Primeiro dia do mês atual
        const inicioMes = new Date(ano, mes, 1);
        
        // Primeiro dia do mês seguinte
        const fimMes = new Date(ano, mes + 1, 1);

        return await MatriculaMov.count({
            where: {
                tipo,
                data_mov: {
                    [Op.gte]: inicioMes,
                    [Op.lt]: fimMes
                }
            }
        });
    }
}

export default RepositoryMatriculasMov;