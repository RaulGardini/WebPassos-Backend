import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface CargoAttributes {
  cargo_id: number;
  nome_cargo: string;
}

interface CargoCreationAttributes
  extends Optional<CargoAttributes, "cargo_id"> {}

class Cargo extends Model<CargoAttributes, CargoCreationAttributes>
  implements CargoAttributes {
  public cargo_id!: number;
  public nome_cargo!: string;
}

Cargo.init(
  {
    cargo_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome_cargo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "cargos",
    timestamps: false,
  }
);

export default Cargo;