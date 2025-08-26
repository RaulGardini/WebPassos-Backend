import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface HorarioTurmaAttributes {
  turma_horario_id: number;
  turma_id: number;
  horario_id: number;
  data_criacao?: Date;
}

interface HorarioTurmaCreationAttributes
  extends Optional<HorarioTurmaAttributes, "turma_horario_id" | "data_criacao"> {}

class HorarioTurma extends Model<HorarioTurmaAttributes, HorarioTurmaCreationAttributes>
  implements HorarioTurmaAttributes {
  public turma_horario_id!: number;
  public turma_id!: number;
  public horario_id!: number;
  public data_criacao?: Date;
}

HorarioTurma.init(
  {
    turma_horario_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    turma_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    horario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "turmas_horarios",
    timestamps: false,
  }
);

export default HorarioTurma;