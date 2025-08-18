import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface AlunoAttributes {
  aluno_id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  sexo?: "M" | "F";
  data_criacao?: Date;
  endereco?: string;
  cep?: string;
  responsavel_financeiro?: string;
  cidade?: string;
  data_nascimento?: Date;
}

interface AlunoCreationAttributes
  extends Optional<AlunoAttributes, "aluno_id" | "data_criacao"> {}

class Aluno extends Model<AlunoAttributes, AlunoCreationAttributes>
  implements AlunoAttributes {
  public aluno_id!: number;
  public nome!: string;
  public email!: string;
  public cpf!: string;
  public telefone?: string;
  public sexo?: "M" | "F";
  public data_criacao?: Date;
  public endereco?: string;
  public cep?: string;
  public responsavel_financeiro?: string;
  public cidade?: string;
  public data_nascimento?: Date;
}

Aluno.init(
  {
    aluno_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
    },
    telefone: {
      type: DataTypes.STRING(15),
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
    endereco: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    cep: {
      type: DataTypes.STRING(9),
      allowNull: true,
    },
    responsavel_financeiro: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    cidade: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    data_nascimento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "alunos",
    timestamps: false,
  }
);

export default Aluno;