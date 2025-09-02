import Matricula from "../Models/Matricula";
import Aluno from "../Models/Aluno";
import Turma from "../Models/Turma";
import MatriculaFilter from "../Filter/Matricula/MatriculaFilter";
import { Op } from "sequelize";

class RepositoryMatricula {
    static async findAlunosDisponiveis(turma_id: number, filter?: MatriculaFilter) {
        const whereAluno: any = {};

        if (filter?.nome) {
            whereAluno.nome = { [Op.iLike]: `%${filter.nome}%` };
        }

        const alunosMatriculadosIds = await Matricula.findAll({
            where: {
                turma_id,
                status: "ativa"
            },
            attributes: ["aluno_id"]
        });

        const idsMatriculados = alunosMatriculadosIds.map(m => m.aluno_id);

        // Buscar alunos que NÃO estão na lista de matriculados
        const whereConditions: any = { ...whereAluno };
        if (idsMatriculados.length > 0) {
            whereConditions.aluno_id = { [Op.notIn]: idsMatriculados };
        }

        return await Aluno.findAll({
            where: whereConditions,
            order: [["nome", "ASC"]]
        });
    }

    static async findAlunosMatriculados(turma_id: number, filter?: MatriculaFilter) {
        const whereAluno: any = {};

        if (filter?.nome) {
            whereAluno.nome = { [Op.iLike]: `%${filter.nome}%` };
        }

        return await Matricula.findAll({
            where: {
                turma_id,
                status: "ativa"
            },
            include: [{
                model: Aluno,
                as: "aluno",
                where: whereAluno
            }],
            order: [["data_matricula", "ASC"]]
        });
    }

    // Criar matrícula
    static async create(matriculaData: any) {
        return await Matricula.create(matriculaData);
    }

    // Buscar matrícula por ID
    static async findById(matricula_id: number) {
        return await Matricula.findByPk(matricula_id, {
            include: [{
                model: Aluno,
                as: "aluno"
            }]
        });
    }

    // Atualizar status da matrícula
    static async updateStatus(matricula_id: number, status: "ativa" | "inativa") {
        const [affectedRows] = await Matricula.update(
            { status },
            { where: { matricula_id } }
        );
        return affectedRows;
    }

    // Verificar se aluno já está matriculado na turma
    static async findMatriculaAtivaByAlunoTurma(aluno_id: number, turma_id: number) {
        return await Matricula.findOne({
            where: {
                aluno_id,
                turma_id,
                status: "ativa"
            }
        });
    }

    // Buscar turma por ID
    static async findTurmaById(turma_id: number) {
        return await Turma.findByPk(turma_id);
    }

    // Gerar próximo número de matrícula
    static async generateNumeroMatricula() {
        const currentYear = new Date().getFullYear();
        const lastMatricula = await Matricula.findOne({
            where: {
                numero_matricula: {
                    [Op.like]: `${currentYear}%`
                }
            },
            order: [["numero_matricula", "DESC"]]
        });

        if (!lastMatricula) {
            return `${currentYear}001`;
        }

        const lastNumber = parseInt(lastMatricula.numero_matricula.substring(4));
        const nextNumber = (lastNumber + 1).toString().padStart(3, "0");
        return `${currentYear}${nextNumber}`;
    }

    // Contar matrículas ativas na turma
    static async countMatriculasAtivasNaTurma(turma_id: number) {
        return await Matricula.count({
            where: {
                turma_id,
                status: "ativa"
            }
        });
    }

    static async delete(matricula_id: number) {
    const deletedRows = await Matricula.destroy({
      where: { matricula_id }
    });
    return deletedRows;
  }
}

export default RepositoryMatricula;