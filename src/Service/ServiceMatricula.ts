import RepositoryMatricula from "../Repository/RepositoryMatricula";
import { CreateMatriculaDTO } from "../DTOs/Matricula/CreateMatriculaDTO";
import MatriculaFilter from "../Filter/Matricula/MatriculaFilter";
import MatriculaMov from "../Models/MatriculaMov";

class ServiceMatricula {
    // Buscar alunos disponíveis para matrícula em uma turma
    static async getAlunosDisponiveis(turma_id: number, filter?: MatriculaFilter) {
        return await RepositoryMatricula.findAlunosDisponiveis(turma_id, filter);
    }

    // Buscar alunos matriculados em uma turma
    static async getAlunosMatriculados(turma_id: number, filter?: MatriculaFilter) {
        return await RepositoryMatricula.findAlunosMatriculados(turma_id, filter);
    }

    // NOVOS MÉTODOS PARA TURMAS POR ALUNO
    // Buscar turmas onde o aluno está matriculado
    static async getTurmasDoAluno(aluno_id: number) {
        // Verificar se aluno existe
        const aluno = await RepositoryMatricula.findAlunoById(aluno_id);
        if (!aluno) {
            throw new Error("Aluno não encontrado");
        }

        return await RepositoryMatricula.findTurmasDoAluno(aluno_id);
    }

    // Buscar turmas disponíveis para matrícula do aluno
    static async getTurmasDisponiveis(aluno_id: number) {
        // Verificar se aluno existe
        const aluno = await RepositoryMatricula.findAlunoById(aluno_id);
        if (!aluno) {
            throw new Error("Aluno não encontrado");
        }

        const turmasDisponiveis = await RepositoryMatricula.findTurmasDisponiveis(aluno_id);
        
        // Adicionar informações de capacidade para cada turma
        const turmasComInfo = await Promise.all(
            turmasDisponiveis.map(async (turma) => {
                const totalMatriculas = await RepositoryMatricula.countMatriculasAtivasNaTurma(turma.turma_id);
                return {
                    ...turma.toJSON(),
                    matriculas_ativas: totalMatriculas,
                    vagas_disponiveis: turma.capacidade - totalMatriculas,
                    turma_lotada: totalMatriculas >= turma.capacidade
                };
            })
        );

        return turmasComInfo;
    }

    // Matricular aluno em uma turma específica (novo endpoint)
    static async matricularAlunoNaTurma(aluno_id: number, turma_id: number) {
        // Verificar se aluno existe
        const aluno = await RepositoryMatricula.findAlunoById(aluno_id);
        if (!aluno) {
            throw new Error("Aluno não encontrado");
        }

        // Verificar se turma existe
        const turma = await RepositoryMatricula.findTurmaById(turma_id);
        if (!turma) {
            throw new Error("Turma não encontrada");
        }

        // Verificar se aluno já está matriculado na turma
        const matriculaExistente = await RepositoryMatricula.findMatriculaAtivaByAlunoTurma(aluno_id, turma_id);
        if (matriculaExistente) {
            throw new Error("Aluno já está matriculado nesta turma");
        }

        // Verificar capacidade da turma
        const totalMatriculas = await RepositoryMatricula.countMatriculasAtivasNaTurma(turma_id);
        if (totalMatriculas >= turma.capacidade) {
            throw new Error("Turma já está com capacidade máxima");
        }

        const isPrimeiraMatricula = await RepositoryMatricula.isPrimeiraMatriculaDoAluno(aluno_id);

        // Gerar número da matrícula
        const numeroMatricula = await RepositoryMatricula.generateNumeroMatricula();

        // Criar matrícula
        const matriculaData = {
            aluno_id,
            turma_id,
            numero_matricula: numeroMatricula,
            valor_matricula: turma.mensalidade,
            data_matricula: new Date(),
            status: "ativa" as const
        };

        const novaMatricula = await RepositoryMatricula.create(matriculaData);
        console.log("Matrícula criada com ID:", novaMatricula.matricula_id);

        // Registrar movimentação apenas se for a primeira matrícula
        if (isPrimeiraMatricula) {
                const movimentacao = await MatriculaMov.create({
                    aluno_id: aluno_id,
                    tipo: "realizada",
                    data_mov: new Date()
                });

        } else {

        }

        // Retornar matrícula com dados do aluno e turma
        return await RepositoryMatricula.findById(novaMatricula.matricula_id);
    }

    // Matricular aluno em uma turma (método original)
    static async matricularAluno(data: CreateMatriculaDTO) {
        const { aluno_id, turma_id } = data;

        // Verificar se turma existe
        const turma = await RepositoryMatricula.findTurmaById(turma_id);
        if (!turma) {
            throw new Error("Turma não encontrada");
        }

        // Verificar se aluno já está matriculado na turma
        const matriculaExistente = await RepositoryMatricula.findMatriculaAtivaByAlunoTurma(aluno_id, turma_id);
        if (matriculaExistente) {
            throw new Error("Aluno já está matriculado nesta turma");
        }

        // Verificar capacidade da turma
        const totalMatriculas = await RepositoryMatricula.countMatriculasAtivasNaTurma(turma_id);
        if (totalMatriculas >= turma.capacidade) {
            throw new Error("Turma já está com capacidade máxima");
        }

        const isPrimeiraMatricula = await RepositoryMatricula.isPrimeiraMatriculaDoAluno(aluno_id);

        // Gerar número da matrícula
        const numeroMatricula = await RepositoryMatricula.generateNumeroMatricula();

        // Criar matrícula
        const matriculaData = {
            aluno_id,
            turma_id,
            numero_matricula: numeroMatricula,
            valor_matricula: turma.mensalidade,
            data_matricula: new Date(),
            status: "ativa" as const
        };

        const novaMatricula = await RepositoryMatricula.create(matriculaData);
        console.log("Matrícula criada com ID:", novaMatricula.matricula_id);

        if (isPrimeiraMatricula) {
                const movimentacao = await MatriculaMov.create({
                    aluno_id: aluno_id,
                    tipo: "realizada",
                    data_mov: new Date()
                });
        } else {
        }

        // Retornar matrícula com dados do aluno
        return await RepositoryMatricula.findById(novaMatricula.matricula_id);
    }

    static async deletarMatricula(matricula_id: number) {
        // Verificar se matrícula existe
        const matricula = await RepositoryMatricula.findById(matricula_id);
        if (!matricula) {
            throw new Error("Matrícula não encontrada");
        }

        const aluno_id = matricula.aluno_id;

        // Contar matrículas do aluno ANTES de deletar
        const countAntes = await RepositoryMatricula.countMatriculasDoAluno(aluno_id);
        
        console.log("=== DELETANDO MATRÍCULA ===");
        console.log("Matrícula ID:", matricula_id);
        console.log("Aluno ID:", aluno_id);
        console.log("Total de matrículas do aluno antes de deletar:", countAntes);

        // Deletar matrícula
        const deletedRows = await RepositoryMatricula.delete(matricula_id);
        if (deletedRows === 0) {
            throw new Error("Erro ao deletar matrícula");
        }
        console.log("Matrícula deletada com sucesso");

        // Se era a última matrícula, registrar movimentação
        if (countAntes === 1) {
            try {
                console.log("Era a última matrícula! Tentando inserir movimentação de encerramento...");
                const movimentacao = await MatriculaMov.create({
                    aluno_id: aluno_id,
                    tipo: "encerrada",
                    data_mov: new Date()
                });
                console.log("Movimentação de encerramento criada com sucesso!", movimentacao.toJSON());
            } catch (error) {
                console.error("ERRO ao registrar movimentação de encerramento:", error);
            }
        } else {
            console.log("Aluno ainda possui outras matrículas, não será registrada movimentação");
        }

        return {
            message: "Matrícula deletada com sucesso",
            matricula_id
        };
    }

    // Buscar dados da turma para exibição
    static async getTurmaInfo(turma_id: number) {
        const turma = await RepositoryMatricula.findTurmaById(turma_id);
        if (!turma) {
            throw new Error("Turma não encontrada");
        }

        const totalMatriculas = await RepositoryMatricula.countMatriculasAtivasNaTurma(turma_id);

        return {
            ...turma.toJSON(),
            matriculas_ativas: totalMatriculas,
            vagas_disponiveis: turma.capacidade - totalMatriculas
        };
    }
}

export default ServiceMatricula;