import AlunosRepository from "../Repository/RepositoryAluno";
import { Op } from "sequelize";

interface AlunoFilters {
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  sexo?: "M" | "F";
  cidade?: string;
  responsavel_financeiro?: string;
}

interface CreateAlunoData {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  sexo?: "M" | "F";
  endereco?: string;
  cep?: string;
  responsavel_financeiro?: string;
  cidade?: string;
  data_nascimento?: Date;
}

interface UpdateAlunoData {
  nome?: string;
  email?: string;
  cpf: string;
  telefone?: string;
  sexo?: "M" | "F";
  endereco?: string;
  cep?: string;
  responsavel_financeiro?: string;
  cidade?: string;
  data_nascimento?: Date;
}

class AlunosService {
  static async getAllAlunos() {
    return await AlunosRepository.findAll();
  }

  static async getAllAlunosWithFilters(filters: AlunoFilters) {
    const whereConditions: any = {};

    if (filters.nome) {
      whereConditions.nome = {
        [Op.iLike]: `%${filters.nome}%`
      };
    }

    if (filters.email) {
      whereConditions.email = {
        [Op.iLike]: `%${filters.email}%`
      };
    }

    if (filters.telefone) {
      whereConditions.telefone = {
        [Op.iLike]: `%${filters.telefone}%`
      };
    }

    if (filters.cidade) {
      whereConditions.cidade = {
        [Op.iLike]: `%${filters.cidade}%`
      };
    }

    if (filters.responsavel_financeiro) {
      whereConditions.responsavel_financeiro = {
        [Op.iLike]: `%${filters.responsavel_financeiro}%`
      };
    }

    if (filters.cpf) {
      whereConditions.cpf = filters.cpf;
    }

    if (filters.sexo) {
      whereConditions.sexo = filters.sexo;
    }

    return await AlunosRepository.findByFilters(whereConditions);
  }

  static async getAlunoById(aluno_id: number) {
    const aluno = await AlunosRepository.findById(aluno_id);
    
    if (!aluno) {
      throw new Error("Aluno não encontrado");
    }

    return aluno;
  }

  static async createAluno(alunoData: CreateAlunoData) {

    alunoData.cpf = alunoData.cpf.replace(/\D/g, "");

    const existingAlunoByCpf = await AlunosRepository.findByCpf(alunoData.cpf);
    if (existingAlunoByCpf) {
      throw new Error("CPF já cadastrado");
    }


    const existingAlunoByNome = await AlunosRepository.findByNome(alunoData.nome);
    if (existingAlunoByNome) {
      throw new Error("Nome já cadastrado");
    }

    return await AlunosRepository.create(alunoData);
  }

  static async updateAluno(aluno_id: number, alunoData: UpdateAlunoData) {

    alunoData.cpf = alunoData.cpf.replace(/\D/g, "");

    const existingAluno = await AlunosRepository.findById(aluno_id);
    if (!existingAluno) {
      throw new Error("Aluno não encontrado");
    }

    if (alunoData.cpf) {
      const existingAlunoByCpf = await AlunosRepository.findByCpf(alunoData.cpf, aluno_id);
      if (existingAlunoByCpf) {
        throw new Error("CPF já cadastrado para outro aluno");
      }
    }

    if (alunoData.nome) {
      const existingAlunoByNome = await AlunosRepository.findByNome(alunoData.nome, aluno_id);
      if (existingAlunoByNome) {
        throw new Error("Nome já cadastrado para outro aluno");
      }
    }

    const affectedRows = await AlunosRepository.update(aluno_id, alunoData);
    
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