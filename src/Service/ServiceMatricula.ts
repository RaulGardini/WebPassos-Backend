import RepositoryMatricula from "../Repository/RepositoryMatricula";
import { CreateMatriculaDTO } from "../DTOs/Matricula/CreateMatriculaDTO";
import MatriculaFilter from "../Filter/Matricula/MatriculaFilter";

class ServiceMatricula {
    // Buscar alunos disponíveis para matrícula em uma turma
    static async getAlunosDisponiveis(turma_id: number, filter?: MatriculaFilter) {
        return await RepositoryMatricula.findAlunosDisponiveis(turma_id, filter);
    }

    // Buscar alunos matriculados em uma turma
    static async getAlunosMatriculados(turma_id: number, filter?: MatriculaFilter) {
        return await RepositoryMatricula.findAlunosMatriculados(turma_id, filter);
    }

    // Matricular aluno em uma turma
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

        // Retornar matrícula com dados do aluno
        return await RepositoryMatricula.findById(novaMatricula.matricula_id);
    }

    static async deletarMatricula(matricula_id: number) {
    // Verificar se matrícula existe
    const matricula = await RepositoryMatricula.findById(matricula_id);
    if (!matricula) {
      throw new Error("Matrícula não encontrada");
    }

    // Deletar matrícula
    const deletedRows = await RepositoryMatricula.delete(matricula_id);
    if (deletedRows === 0) {
      throw new Error("Erro ao deletar matrícula");
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