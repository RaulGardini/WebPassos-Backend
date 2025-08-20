import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ColaboradorAttributes {
  colaborador_id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  sexo?: "M" | "F";
  data_criacao?: Date;
  data_nascimento: Date;
  cargo_id: number;
}

interface ColaboradorCreationAttributes
  extends Optional<ColaboradorAttributes, "colaborador_id" | "data_criacao"> {}

class Colaborador extends Model<ColaboradorAttributes, ColaboradorCreationAttributes>
  implements ColaboradorAttributes {
  public colaborador_id!: number;
  public nome!: string;
  public email!: string;
  public cpf!: string;
  public telefone?: string;
  public sexo?: "M" | "F";
  public data_criacao?: Date;
  public data_nascimento!: Date;
  public cargo_id!: number;
}

Colaborador.init(
  {
    colaborador_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true,
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    sexo: {
      type: DataTypes.ENUM("M", "F"),
      allowNull: true,
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    data_nascimento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cargo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "colaboradores",
    timestamps: false,
  }
);

export default Colaborador;