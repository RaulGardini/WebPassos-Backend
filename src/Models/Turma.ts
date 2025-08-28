import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface TurmaAttributes {
  turma_id: number;
  nome: string;
  sala_id: number;
  modalidade_id: number;
  professor1_id?: number;
  professor2_id?: number;
  status: "ativa" | "inativa";
  mensalidade: number;
  data_criacao?: Date;
  capacidade: number;
}

interface TurmaCreationAttributes
  extends Optional<TurmaAttributes, "turma_id" | "professor1_id" | "professor2_id" | "data_criacao"> {}

class Turma extends Model<TurmaAttributes, TurmaCreationAttributes>
  implements TurmaAttributes {
  public turma_id!: number;
  public nome!: string;
  public sala_id!: number;
  public modalidade_id!: number;
  public professor1_id?: number;
  public professor2_id?: number;
  public status!: "ativa" | "inativa";
  public mensalidade!: number;
  public data_criacao?: Date;
  public capacidade!: number;
}

Turma.init(
  {
    turma_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    sala_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modalidade_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    professor1_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    professor2_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("ativa", "inativa"),
      allowNull: false,
    },
    mensalidade: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    capacidade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "turmas",
    timestamps: false,
  }
);

export default Turma;
