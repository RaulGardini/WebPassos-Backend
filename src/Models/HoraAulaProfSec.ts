import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface HoraAulaAttributes {
  hora_aula_prof_sec_id: number;
  quant_alunos_prof_sec: number;
  valor_hora_aula_prof_sec: number;
}

interface HoraAulaCreationAttributes
  extends Optional<HoraAulaAttributes, "hora_aula_prof_sec_id"> {}

class HoraAulaProfSec extends Model<HoraAulaAttributes, HoraAulaCreationAttributes>
  implements HoraAulaAttributes {
  public hora_aula_prof_sec_id!: number;
  public quant_alunos_prof_sec!: number;
  public valor_hora_aula_prof_sec!: number;
}

HoraAulaProfSec.init(
  {
    hora_aula_prof_sec_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quant_alunos_prof_sec: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valor_hora_aula_prof_sec: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "hora_aula_prof_sec",
    timestamps: false,
  }
);

export default HoraAulaProfSec;