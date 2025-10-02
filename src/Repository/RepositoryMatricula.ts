import Matricula from "../Models/Matricula";
import Aluno from "../Models/Aluno";
import Turma from "../Models/Turma";
import MatriculaMov from "../Models/MatriculaMov";
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

    static async findTurmasDoAluno(aluno_id: number) {
        return await Matricula.findAll({
            where: {
                aluno_id,
                status: "ativa"
            },
            include: [{
                model: Turma,
                as: "turma"
            }],
            order: [["data_matricula", "ASC"]]
        });
    }

    static async findTurmasDisponiveis(aluno_id: number) {
        // Buscar IDs das turmas onde o aluno já está matriculado
        const turmasMatriculadas = await Matricula.findAll({
            where: {
                aluno_id,
                status: "ativa"
            },
            attributes: ["turma_id"]
        });

        const idsMatriculadas = turmasMatriculadas.map(m => m.turma_id);

        // Buscar turmas que NÃO estão na lista de matriculadas
        const whereConditions: any = {};
        if (idsMatriculadas.length > 0) {
            whereConditions.turma_id = { [Op.notIn]: idsMatriculadas };
        }

        return await Turma.findAll({
            where: whereConditions,
            order: [["nome", "ASC"]]
        });
    }

    static async findAlunoById(aluno_id: number) {
        return await Aluno.findByPk(aluno_id);
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

    // Verificar se é a primeira matrícula do aluno
    static async isPrimeiraMatriculaDoAluno(aluno_id: number) {
        const count = await Matricula.count({
            where: { aluno_id }
        });
        return count === 0;
    }

    // Contar quantas matrículas o aluno ainda possui
    static async countMatriculasDoAluno(aluno_id: number) {
        return await Matricula.count({
            where: { aluno_id }
        });
    }

    // Criar registro de movimentação de matrícula
    static async createMatriculaMov(data: {
        aluno_id: number;
        tipo: string;
    }) {
        return await MatriculaMov.create({
            aluno_id: data.aluno_id,
            tipo: data.tipo,
            data_mov: new Date()
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