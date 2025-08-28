import HorarioTurma from "../Models/HorarioTurma";
import { Op } from "sequelize";
import { HorarioTurmaFilter } from "../Filter/HorarioTurma/HorarioTurmaFilter";

export class HorariosTurmasRepository {
  static async findAll(filter?: HorarioTurmaFilter) {
    const where: any = {};

    if (filter?.turma_id) {
      where.turma_id = filter.turma_id;
    }
    if (filter?.horario_id) {
      where.horario_id = filter.horario_id;
    }

    return await HorarioTurma.findAll({ where });
  }

  static async findById(horario_turma_id: number) {
    return await HorarioTurma.findByPk(horario_turma_id);
  }

  static async findByTurmaId(turma_id: number) {
    return await HorarioTurma.findAll({
      where: { turma_id }
    });
  }

  static async findByTurmaAndHorario(turma_id: number, horario_id: number) {
    return await HorarioTurma.findOne({
      where: { turma_id, horario_id }
    });
  }

  static async create(horarioTurmaData: any) {
    return await HorarioTurma.create(horarioTurmaData);
  }

  static async createMultiple(horariosTurmasData: any[]) {
    return await HorarioTurma.bulkCreate(horariosTurmasData);
  }

  static async update(turma_horario_id: number, horarioTurmaData: any) {
    const [affectedRows] = await HorarioTurma.update(horarioTurmaData, {
      where: { turma_horario_id },
    });
    return affectedRows;
  }

  static async delete(turma_horario_id: number) {
    return await HorarioTurma.destroy({ where: { turma_horario_id } });
  }

  static async deleteByTurmaAndHorario(turma_id: number, horario_id: number) {
    return await HorarioTurma.destroy({
      where: { turma_id, horario_id }
    });
  }

  static async deleteAllByTurma(turma_id: number) {
    return await HorarioTurma.destroy({
      where: { turma_id }
    });
  }
}