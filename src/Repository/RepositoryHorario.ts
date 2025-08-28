import Horario from "../Models/Horario";
import Turma from "../Models/Turma";
import HorarioTurma from "../Models/HorarioTurma";
import { Op } from "sequelize";

class RepositoryHorario {
    static async findAll() {
        return await Horario.findAll();
    }

    static async findById(horarios_id: number) {
        return await Horario.findByPk(horarios_id);
    }

    static async create(horarioData: any) {
        return await Horario.create(horarioData);
    }

    static async update(horario_id: number, horarioData: any) {
        const [affectedRows] = await Horario.update(horarioData, {
            where: { horario_id },
        });
        return affectedRows;
    }

    static async delete(horario_id: number) {
        return await Horario.destroy({ where: { horario_id } });
    }

    static async findAvailableForTurma(turmaId: number) {
    try {
      // Primeiro, buscar a sala da turma usando Sequelize ORM
      const turma = await Turma.findByPk(turmaId);
      
      if (!turma) {
        throw new Error("Turma não encontrada");
      }

      const salaId = turma.sala_id;

      // Buscar todas as turmas ativas da mesma sala (exceto a turma atual)
      const turmasMemaSala = await Turma.findAll({
        where: {
          sala_id: salaId,
          turma_id: { [Op.ne]: turmaId }, // diferente da turma atual
          status: 'ativa'
        },
        attributes: ['turma_id']
      });

      const turmasIds = turmasMemaSala.map(t => t.turma_id);

      let horariosOcupadosIds: number[] = [];

      if (turmasIds.length > 0) {
        // Buscar horários ocupados por essas turmas
        const horariosOcupados = await HorarioTurma.findAll({
          where: {
            turma_id: { [Op.in]: turmasIds }
          },
          attributes: ['horario_id']
        });

        horariosOcupadosIds = horariosOcupados.map(ht => ht.horario_id);
      }

      // Buscar todos os horários exceto os ocupados
      const whereCondition: any = {};
      if (horariosOcupadosIds.length > 0) {
        whereCondition.horario_id = {
          [Op.notIn]: horariosOcupadosIds
        };
      }

      return await Horario.findAll({
        where: whereCondition,
        order: [['dia_semana', 'ASC'], ['horario', 'ASC']]
      });

    } catch (error: any) {
      throw new Error(`Erro ao buscar horários disponíveis: ${error.message}`);
    }
  }
}

export default RepositoryHorario;