import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ModalidadeAttributes {
  modalidade_id: number;
  nome_modalidade: string;
}

interface ModalidadeCreationAttributes
  extends Optional<ModalidadeAttributes, "modalidade_id"> {}

class Modalidade extends Model<ModalidadeAttributes, ModalidadeCreationAttributes>
  implements ModalidadeAttributes {
  public modalidade_id!: number;
  public nome_modalidade!: string;
}

Modalidade.init(
  {
    modalidade_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome_modalidade: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "modalidades",
    timestamps: false,
  }
);

export default Modalidade;