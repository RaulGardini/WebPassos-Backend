import AlunosRepository from "../Repository/RepositoryAluno";
import { CreateAlunoDTO } from "../DTOs/Aluno/CreateAlunoDTO";
import { UpdateAlunoDTO } from "../DTOs/Aluno/UpdateAlunoDTO";
import { ReadAlunoDTO } from "../DTOs/Aluno/ReadAlunoDTO";
import { AlunoFilter } from "../Filter/Aluno/AlunoFilter";
import { PaginationOptions, PaginatedResult } from "../Pagination/Pagination";

class AlunosService {
  static async getAllAlunos(filter?: AlunoFilter, pagination?: PaginationOptions): Promise<PaginatedResult<ReadAlunoDTO> | ReadAlunoDTO[]> {
    const result = await AlunosRepository.findAll(filter, pagination);
    
    if (pagination && !('pagination' in result)) {
      const data = result as ReadAlunoDTO[];
      const totalItems = data.length;
      const totalPages = Math.ceil(totalItems / pagination.limit);
      
      return {
        data,
        pagination: {
          currentPage: pagination.page,
          totalPages,
          totalItems,
          itemsPerPage: pagination.limit,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1
        }
      };
    }
    
    return result;
  }

  static async getAlunoById(aluno_id: number): Promise<ReadAlunoDTO> {
    const aluno = await AlunosRepository.findById(aluno_id);
    
    if (!aluno) {
      throw new Error("Aluno não encontrado");
    }
    
    return aluno;
  }

  static async createAluno(data: CreateAlunoDTO): Promise<ReadAlunoDTO> {
    data.cpf = data.cpf.replace(/\D/g, "");
    return await AlunosRepository.create(data);
  }

  static async updateAluno(aluno_id: number, data: UpdateAlunoDTO): Promise<ReadAlunoDTO> {
    if (data.cpf) data.cpf = data.cpf.replace(/\D/g, "");
    
    const affectedRows = await AlunosRepository.update(aluno_id, data);
    
    if (affectedRows === 0) {
      throw new Error("Aluno não encontrado");
    }
    
    const alunoAtualizado = await AlunosRepository.findById(aluno_id);
    
    if (!alunoAtualizado) {
      throw new Error("Erro ao buscar aluno atualizado");
    }
    
    return alunoAtualizado;
  }

  static async deleteAluno(aluno_id: number): Promise<{ message: string }> {
    const existingAluno = await AlunosRepository.findById(aluno_id);
    
    if (!existingAluno) {
      throw new Error("Aluno não encontrado");
    }
    
    await AlunosRepository.delete(aluno_id);
    
    return { message: "Aluno deletado com sucesso" };
  }
}

export default AlunosService;