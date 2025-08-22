import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface SalaAttributes {
  sala_id: number;
  nome_sala: string;
}

interface SalaCreationAttributes
  extends Optional<SalaAttributes, "sala_id"> {}

class Sala extends Model<SalaAttributes, SalaCreationAttributes>
  implements SalaAttributes {
  public sala_id!: number;
  public nome_sala!: string;
}

Sala.init(
  {
    sala_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome_sala: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "salas",
    timestamps: false,
  }
);

export default Sala;