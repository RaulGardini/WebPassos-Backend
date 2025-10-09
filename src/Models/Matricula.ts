import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Aluno from './Aluno';
import Turma from './Turma';

interface MatriculaAttributes {
  matricula_id: number;
  numero_matricula: string;
  aluno_id: number;
  turma_id: number;
  status: "ativa" | "inativa";
  valor_matricula: number;
  data_matricula: Date;
  desconto_perc: number;
  desconto_num: number;
  valor_final:number;
}

interface MatriculaCreationAttributes extends Optional<MatriculaAttributes, "matricula_id" | "data_matricula" | "desconto_perc" | "desconto_num"> {}

class Matricula extends Model<MatriculaAttributes, MatriculaCreationAttributes> implements MatriculaAttributes {
  public matricula_id!: number;
  public numero_matricula!: string;
  public aluno_id!: number;
  public turma_id!: number;
  public status!: "ativa" | "inativa";
  public valor_matricula!: number;
  public data_matricula!: Date;
  public desconto_perc!: number;
  public desconto_num!: number;
  public valor_final!: number;
}

Matricula.init(
  {
    matricula_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    numero_matricula: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    aluno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    turma_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("ativa", "inativa"),
      allowNull: false,
      defaultValue: "ativa",
    },
    valor_matricula: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    data_matricula: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    desconto_perc: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    desconto_num: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
    valor_final: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: "matriculas",
    timestamps: false,
  }
);
Matricula.belongsTo(Aluno, {
  foreignKey: 'aluno_id',
  as: 'aluno'
});

Matricula.belongsTo(Turma, {
  foreignKey: 'turma_id', 
  as: 'turma'
});

export default Matricula;