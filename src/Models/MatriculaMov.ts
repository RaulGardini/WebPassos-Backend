import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface MatriculaMovAttributes {
  matricula_mov_id: number;
  tipo: string;
  data_mov: Date;
  aluno_id: number;
}

interface MatriculaMovCreationAttributes extends Optional<MatriculaMovAttributes, "matricula_mov_id" | "data_mov"> {}

class MatriculaMov extends Model<MatriculaMovAttributes, MatriculaMovCreationAttributes> implements MatriculaMovAttributes {
  public matricula_mov_id!: number;
  public tipo!: string;
  public data_mov!: Date;
  public aluno_id!: number;
}

MatriculaMov.init(
  {
    matricula_mov_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    data_mov: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    aluno_id: {
       type: DataTypes.INTEGER,
       allowNull: false,
    }
  },
  {
    sequelize,
    tableName: "matriculas_mov",
    timestamps: false,
  }
);

export default MatriculaMov;
