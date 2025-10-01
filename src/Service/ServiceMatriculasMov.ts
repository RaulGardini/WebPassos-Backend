import RepositoryMatriculasMov from "../Repository/RepositoryMatriculasMov";
import { ReadMatriculasMovDTO } from "../DTOs/MatriculasMov/ReadMatriculasMovDTO";

class ServiceMatriculasMov {
    static async getContagemMovimentacoes(): Promise<ReadMatriculasMovDTO> {
        const totalRealizadas = await RepositoryMatriculasMov.countByTipo("realizada");
        const totalEncerradas = await RepositoryMatriculasMov.countByTipo("encerrada");

        return {
            total_realizadas: totalRealizadas,
            total_encerradas: totalEncerradas,
        };
    }
}

export default ServiceMatriculasMov;