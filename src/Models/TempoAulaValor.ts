import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface TempoAulaValorAttributes {
  tempo_aula_valor_id: number;
  duracao_aula: number;
  valor_aula: number;
}

interface TempoAulaValorCreationAttributes
  extends Optional<TempoAulaValorAttributes, "tempo_aula_valor_id"> {}

class TempoAulaValor extends Model<TempoAulaValorAttributes, TempoAulaValorCreationAttributes>
  implements TempoAulaValorAttributes {
  public tempo_aula_valor_id!: number;
  public duracao_aula!: number;
  public valor_aula!: number;
}

TempoAulaValor.init(
  {
    tempo_aula_valor_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    duracao_aula: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    valor_aula: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "tempo_aula_valor",
    timestamps: false,
  }
);

export default TempoAulaValor;