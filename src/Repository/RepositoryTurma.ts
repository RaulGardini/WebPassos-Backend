import Turma from "../Models/Turma";
import Horario from "../Models/Horario";
import TurmaHorario from "../Models/HorarioTurma";
import Sala from "../Models/Sala";
import { Op } from "sequelize";
import { TurmaFilter } from "../Filter/Turma/TurmaFilter";

Turma.belongsToMany(Horario, { through: TurmaHorario, foreignKey: "turma_id", as: "horarios" });
Horario.belongsToMany(Turma, { through: TurmaHorario, foreignKey: "horario_id", as: "turmas" });

export class TurmasRepository {
  static async findAll(filter?: TurmaFilter) {
    const where: any = {};

    if (filter?.nome) {
      where.nome = { [Op.iLike]: `%${filter.nome}%` };
    }
    if (filter?.professor1_id) {
      where.professor1_id = filter.professor1_id;
    }
    if (filter?.sala_id) {
      where.sala_id = filter.sala_id;
    }
    if (filter?.status) {
      where.status = filter.status;
    }
    if (filter?.modalidade_id) {
      where.modalidade_id = filter.modalidade_id;
    }

    return await Turma.findAll({
      where,
      include: [
        {
          model: Horario,
          as: "horarios",
          attributes: ["horario_id", "dia_semana", "horario"],
          through: { attributes: [] } // esconde a tabela pivot
        }
      ]
    });
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

  static async findAulasPorDia(diaSemana: string) {
    return await Turma.findAll({
      where: {
        status: 'ativa' // apenas turmas ativas
      },
      include: [
        {
          model: Horario,
          as: "horarios",
          where: {
            dia_semana: {
              [Op.iLike]: `%${diaSemana}%` // busca case-insensitive
            }
          },
          attributes: ["horario_id", "dia_semana", "horario"],
          through: { attributes: [] } // esconde a tabela pivot
        }
      ],
      attributes: [
        "turma_id",
        "nome",
        "sala_id",
        "modalidade_id",
        "professor1_id",
        "professor2_id",
        "capacidade"
      ],
      order: [
        [{ model: Horario, as: "horarios" }, "horario", "ASC"] // ordena por horário
      ]
    });
  }

  static async findAulasHojePorColaborador(colaboradorId: number) {
    const hoje = new Date();
    const diasSemana = [
      'domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'
    ];
    const diaHoje = diasSemana[hoje.getDay()];

    return await Turma.findAll({
      where: {
        status: 'ativa',
        [Op.or]: [
          { professor1_id: colaboradorId },
          { professor2_id: colaboradorId }
        ]
      },
      include: [
        {
          model: Horario,
          as: "horarios",
          where: {
            dia_semana: {
              [Op.iLike]: `%${diaHoje}%`
            }
          },
          attributes: ["horario_id", "dia_semana", "horario"],
          through: { attributes: [] }
        }
      ],
      attributes: [
        "turma_id",
        "nome",
        "sala_id",
        "modalidade_id",
        "professor1_id",
        "professor2_id",
        "capacidade"
      ],
      order: [
        [{ model: Horario, as: "horarios" }, "horario", "ASC"]
      ]
    });
  }
}