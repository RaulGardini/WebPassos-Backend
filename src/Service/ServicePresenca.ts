import RepositoryPresenca from "../Repository/RepositoryPresenca";
import Chamada from "../Models/Chamada";
import Matricula from "../Models/Matricula";

class ServicePresenca {
    static async criarPresencas(chamada_id: number) {
        const chamada = await Chamada.findByPk(chamada_id);
        
        if (!chamada) {
            throw new Error('Chamada não encontrada');
        }

        const presencasExistentes = await RepositoryPresenca.findByChamadaId(chamada_id);
        
        if (presencasExistentes.length > 0) {
            throw new Error('Já existem presenças cadastradas para esta chamada');
        }

        const matriculas = await Matricula.findAll({
            where: { turma_id: chamada.turma_id }
        });

        if (matriculas.length === 0) {
            throw new Error('Nenhum aluno matriculado nesta turma');
        }

        const presencasParaCriar = matriculas.map(matricula => ({
            chamada_id: chamada_id,
            aluno_id: matricula.aluno_id,
            status: "presente" as "presente" | "falta"
        }));

        const presencasCriadas = await RepositoryPresenca.createMultiple(presencasParaCriar);

        return {
            message: `${presencasCriadas.length} presença(s) criada(s) com sucesso`,
            chamada_id: chamada_id,
            total_alunos: presencasCriadas.length,
            presencas: presencasCriadas
        };
    }

    static async atualizarStatus(presenca_id: number, status: "presente" | "falta") {
        if (!["presente", "falta"].includes(status)) {
            throw new Error('Status inválido. Use "presente" ou "falta"');
        }

        const presencaAtualizada = await RepositoryPresenca.updateStatus(presenca_id, status);

        return {
            message: "Status atualizado com sucesso",
            presenca: presencaAtualizada
        };
    }

    static async listarPresencas(chamada_id: number) {
        const chamada = await Chamada.findByPk(chamada_id);
        
        if (!chamada) {
            throw new Error('Chamada não encontrada');
        }

        const presencas = await RepositoryPresenca.findByChamadaIdWithAlunos(chamada_id);

        if (presencas.length === 0) {
            return {
                message: 'Nenhuma presença cadastrada para esta chamada',
                chamada_id: chamada_id,
                total: 0,
                presentes: 0,
                faltas: 0,
                presencas: []
            };
        }

        const presentes = presencas.filter(p => p.status === "presente").length;
        const faltas = presencas.filter(p => p.status === "falta").length;

        const presencasFormatadas = presencas.map(p => ({
            presenca_id: p.presenca_id,
            chamada_id: p.chamada_id,
            aluno_id: p.aluno_id,
            status: p.status,
            aluno: (p as any).Aluno?.nome || 'Nome não encontrado'
        }));

        return {
            message: `${presencas.length} presença(s) encontrada(s)`,
            chamada_id: chamada_id,
            total: presencas.length,
            presentes: presentes,
            faltas: faltas,
            presencas: presencasFormatadas
        };
    }
}

export default ServicePresenca;