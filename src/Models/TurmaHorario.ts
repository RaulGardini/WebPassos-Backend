import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface TurmaHorarioAttributes {
  turma_horario_id: number;
  turma_id: number;
  horario_id: number;   
}

interface TurmaHorarioCreationAttributes
  extends Optional<TurmaHorarioAttributes, "turma_horario_id"> {}

class TurmaHorario extends Model<TurmaHorarioAttributes, TurmaHorarioCreationAttributes>
  implements TurmaHorarioAttributes {
  public turma_horario_id!: number;
  public turma_id!: number;
  public horario_id!: number;
}

TurmaHorario.init(
  {
    turma_horario_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    turma_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    horario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: "turmas_horarios",
    timestamps: false,
  }
);

export default TurmaHorario;
