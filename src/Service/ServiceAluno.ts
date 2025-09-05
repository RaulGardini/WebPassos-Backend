import AlunosRepository from "../Repository/RepositoryAluno";
import { CreateAlunoDTO } from "../DTOs/Aluno/CreateAlunoDTO";
import { UpdateAlunoDTO } from "../DTOs/Aluno/UpdateAlunoDTO";
import { AlunoFilter } from "../Filter/Aluno/AlunoFilter";

class AlunosService {
  static async getAllAlunos(filter?: AlunoFilter) {
    return await AlunosRepository.findAll(filter);
  }

  static async getAlunoById(aluno_id: number) {
    const aluno = await AlunosRepository.findById(aluno_id);
    
    if (!aluno) {
      throw new Error("Aluno não encontrado");
    }

    return aluno;
  }

  static async createAluno(data: CreateAlunoDTO) {
    data.cpf = data.cpf.replace(/\D/g, "");

    const existingAlunoByCpf = await AlunosRepository.findByCpf(data.cpf);
    if (existingAlunoByCpf) {
      throw new Error("CPF já cadastrado");
    }

    const existingAlunoByNome = await AlunosRepository.findByNome(data.nome);
    if (existingAlunoByNome) {
      throw new Error("Nome já cadastrado");
    }

    return await AlunosRepository.create(data);
  }

  static async updateAluno(aluno_id: number, data: UpdateAlunoDTO) {
    if (data.cpf) data.cpf = data.cpf.replace(/\D/g, "");

    const existingAluno = await AlunosRepository.findById(aluno_id);
    if (!existingAluno) {
      throw new Error("Aluno não encontrado");
    }

    if (data.cpf) {
      const existingAlunoByCpf = await AlunosRepository.findByCpf(data.cpf, aluno_id);
      if (existingAlunoByCpf) {
        throw new Error("CPF já cadastrado para outro aluno");
      }
    }

    if (data.nome) {
      const existingAlunoByNome = await AlunosRepository.findByNome(data.nome, aluno_id);
      if (existingAlunoByNome) {
        throw new Error("Nome já cadastrado para outro aluno");
      }
    }

    const affectedRows = await AlunosRepository.update(aluno_id, data);
    
    if (affectedRows === 0) {
      throw new Error("Erro ao atualizar aluno");
    }

    return await AlunosRepository.findById(aluno_id);
  }

  static async deleteAluno(aluno_id: number) {
    const existingAluno = await AlunosRepository.findById(aluno_id);
    if (!existingAluno) {
      throw new Error("Aluno não encontrado");
    }

    const deletedRows = await AlunosRepository.delete(aluno_id);
    
    if (deletedRows === 0) {
      throw new Error("Erro ao deletar aluno");
    }

    return { message: "Aluno deletado com sucesso" };
  }
}

export default AlunosService;