import Turma from "../Models/Turma";
import { Op } from "sequelize";
import { TurmaFilter } from "../Filter/Turma/TurmaFilter";

export class TurmasRepository {
  static async findAll(filter?: TurmaFilter) {
    const where: any = {};

    if (filter?.nome) {
      where.nome = { [Op.iLike]: `%${filter.nome}%` }; // busca parcial
    }
    if (filter?.status) {
      where.status = filter.status;
    }
    if (filter?.modalidade_id) {
      where.modalidade_id = filter.modalidade_id;
    }

    return await Turma.findAll({ where });
  }

  static async findById(turma_id: number) {
    return await Turma.findByPk(turma_id);
  }

  static async create(turmaData: any) {
    return await Turma.create(turmaData);
  }

  static async update(turma_id: number, turmaData: any) {
    const [affectedRows] = await Turma.update(turmaData, {
      where: { turma_id },
    });
    return affectedRows;
  }

  static async delete(turma_id: number) {
    return await Turma.destroy({ where: { turma_id } });
  }
}