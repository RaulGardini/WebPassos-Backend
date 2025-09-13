import Alunos from "../Models/Aluno";
import { Op } from "sequelize";
import { AlunoFilter } from "../Filter/Aluno/AlunoFilter";
import { PaginationOptions, PaginatedResult } from "../Pagination/Pagination";

class AlunosRepository {
  static async findAll(filter?: AlunoFilter, pagination?: PaginationOptions): Promise<PaginatedResult<any> | any[]> {
    const where: any = {};

    if (filter?.nome) {
      where.nome = { [Op.iLike]: `%${filter.nome}%` };
    }
    if (filter?.email) {
      where.email = { [Op.iLike]: `%${filter.email}%` };
    }
    if (filter?.cpf) {
      where.cpf = filter.cpf;
    }
    if (filter?.telefone) {
      where.telefone = { [Op.iLike]: `%${filter.telefone}%` };
    }
    if (filter?.sexo) {
      where.sexo = filter.sexo;
    }
    if (filter?.cidade) {
      where.cidade = { [Op.iLike]: `%${filter.cidade}%` };
    }
    if (filter?.responsavel_financeiro) {
      where.responsavel_financeiro = { [Op.iLike]: `%${filter.responsavel_financeiro}%` };
    }

    // Se não há paginação, retorna todos os resultados
    if (!pagination) {
      return await Alunos.findAll({ where });
    }

    // Com paginação
    const offset = (pagination.page - 1) * pagination.limit;
    
    const result = await Alunos.findAndCountAll({
      where,
      limit: pagination.limit,
      offset,
      order: [['aluno_id', 'ASC']]
    });

    const totalPages = Math.ceil(result.count / pagination.limit);

    return {
      data: result.rows,
      pagination: {
        currentPage: pagination.page,
        totalPages,
        totalItems: result.count,
        itemsPerPage: pagination.limit,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1
      }
    };
  }

  static async findById(aluno_id: number) {
    return await Alunos.findByPk(aluno_id);
  }

  static async create(alunoData: any) {
    return await Alunos.create(alunoData);
  }

  static async update(aluno_id: number, alunoData: any) {
    const [affectedRows] = await Alunos.update(alunoData, {
      where: { aluno_id }
    });
    return affectedRows;
  }

  static async delete(aluno_id: number) {
    return await Alunos.destroy({
      where: { aluno_id }
    });
  }

  static async findByCpf(cpf: string, excludeId?: number) {
    const whereCondition: any = { cpf };
    if (excludeId) {
      whereCondition.aluno_id = { [Op.ne]: excludeId };
    }
    return await Alunos.findOne({ where: whereCondition });
  }

  static async findByNome(nome: string, excludeId?: number) {
    const whereCondition: any = { nome };
    if (excludeId) {
      whereCondition.aluno_id = { [Op.ne]: excludeId };
    }
    return await Alunos.findOne({ where: whereCondition });
  }
}

export default AlunosRepository;