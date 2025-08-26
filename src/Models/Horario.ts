import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface HorarioAttributes {
  horario_id: number;
  dia_semana: string;
  horario: string;
}

interface HorarioCreationAttributes extends Optional<HorarioAttributes, "horario_id"> {}

class Horario extends Model<HorarioAttributes, HorarioCreationAttributes>
  implements HorarioAttributes {
  public horario_id!: number;
  public dia_semana!: string;
  public horario!: string;
}

Horario.init(
  {
    horario_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dia_semana: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    horario: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "horarios",
    timestamps: false,
  }
);

export default Horario;
