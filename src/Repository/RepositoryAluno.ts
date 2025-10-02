import Alunos from "../Models/Aluno";
import { Op } from "sequelize";
import { AlunoFilter } from "../Filter/Aluno/AlunoFilter";
import { PaginationOptions, PaginatedResult } from "../Pagination/Pagination";
import { ReadAlunoDTO } from "../DTOs/Aluno/ReadAlunoDTO";
import { CreateAlunoDTO } from "../DTOs/Aluno/CreateAlunoDTO";
import { UpdateAlunoDTO } from "../DTOs/Aluno/UpdateAlunoDTO";
import sequelize from "../config/database";

class AlunosRepository {
  static async findAll(filter?: AlunoFilter, pagination?: PaginationOptions): Promise<PaginatedResult<ReadAlunoDTO> | ReadAlunoDTO[]> {
    const where: any = {};

    if (filter?.nome) {
      where.nome = { [Op.iLike]: `%${filter.nome}%` };
    }
    if (filter?.email) {
      where.email = { [Op.iLike]: `%${filter.email}%` };
    }
    if (filter?.telefone) {
      where.telefone = { [Op.iLike]: `%${filter.telefone}%` };
    }
    if (filter?.cidade) {
      where.cidade = { [Op.iLike]: `%${filter.cidade}%` };
    }
    if (filter?.responsavel_financeiro) {
      where.responsavel_financeiro = { [Op.iLike]: `%${filter.responsavel_financeiro}%` };
    }
    if (filter?.mes_nascimento) {
      where[Op.and] = sequelize.where(
        sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM data_nascimento')),
        filter.mes_nascimento
      );
    }

    if (!pagination) {
      const alunos = await Alunos.findAll({ where });
      return alunos.map(aluno => aluno.toJSON() as ReadAlunoDTO);
    }

    const offset = (pagination.page - 1) * pagination.limit;
    
    const result = await Alunos.findAndCountAll({
      where,
      limit: pagination.limit,
      offset,
      order: [['aluno_id', 'ASC']]
    });

    const totalPages = Math.ceil(result.count / pagination.limit);

    return {
      data: result.rows.map(aluno => aluno.toJSON() as ReadAlunoDTO),
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

  static async findById(aluno_id: number): Promise<ReadAlunoDTO | null> {
    const aluno = await Alunos.findByPk(aluno_id);
    return aluno ? aluno.toJSON() as ReadAlunoDTO : null;
  }

  static async create(alunoData: CreateAlunoDTO): Promise<ReadAlunoDTO> {
    const aluno = await Alunos.create(alunoData);
    return aluno.toJSON() as ReadAlunoDTO;
  }

  static async update(aluno_id: number, alunoData: UpdateAlunoDTO): Promise<number> {
    const [affectedRows] = await Alunos.update(alunoData, {
      where: { aluno_id }
    });
    return affectedRows;
  }

  static async delete(aluno_id: number): Promise<number> {
    return await Alunos.destroy({
      where: { aluno_id }
    });
  }
}

export default AlunosRepository;