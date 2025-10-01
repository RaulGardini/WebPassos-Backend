import MatriculaMov from "../Models/MatriculaMov";

class RepositoryMatriculasMov {
    static async countByTipo(tipo: string) {
        return await MatriculaMov.count({
            where: { tipo }
        });
    }
}

export default RepositoryMatriculasMov;