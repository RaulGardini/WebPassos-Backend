import Presenca from "../Models/Presenca";
import Aluno from "../Models/Aluno";

class RepositoryPresenca {
    static async createMultiple(presencasData: any[]) {
        return await Presenca.bulkCreate(presencasData);
    }

    static async updateStatus(presenca_id: number, status: "presente" | "falta") {
        const presenca = await Presenca.findByPk(presenca_id);
        
        if (!presenca) {
            throw new Error('Presença não encontrada');
        }

        presenca.status = status;
        await presenca.save();
        
        return presenca;
    }

    static async findByChamadaId(chamada_id: number) {
        return await Presenca.findAll({
            where: { chamada_id }
        });
    }

    static async findByChamadaIdWithAlunos(chamada_id: number) {
        return await Presenca.findAll({
            where: { chamada_id },
            include: [{
                model: Aluno,
                attributes: ['aluno_id', 'nome', 'email']
            }],
            order: [['aluno_id', 'ASC']]
        });
    }
}

export default RepositoryPresenca;