import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface UsuarioAttributes {
  id: number;
  login: string;
  senha: string;
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, "id"> {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes>
  implements UsuarioAttributes {
  public id!: number;
  public login!: string;
  public senha!: string;
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "usuarios",
    timestamps: false,
  }
);

export default Usuario;
