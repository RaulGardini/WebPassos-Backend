import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface HoraAulaAttributes {
  hora_aula_id: number;
  quant_alunos: number;
  valor_hora_aula: number;
}

interface HoraAulaCreationAttributes
  extends Optional<HoraAulaAttributes, "hora_aula_id"> {}

class HoraAula extends Model<HoraAulaAttributes, HoraAulaCreationAttributes>
  implements HoraAulaAttributes {
  public hora_aula_id!: number;
  public quant_alunos!: number;
  public valor_hora_aula!: number;
}

HoraAula.init(
  {
    hora_aula_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quant_alunos: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valor_hora_aula: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "hora_aula",
    timestamps: false,
  }
);

export default HoraAula;