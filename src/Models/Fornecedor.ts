import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface FornecedorAttributes {
    fornecedor_id: number;
    nome: string;
    email: string;
    telefone: string;
}

interface FornecedorCreationAttributes
    extends Optional<FornecedorAttributes, "fornecedor_id"> { }

class Fornecedor extends Model<FornecedorAttributes, FornecedorCreationAttributes>
    implements FornecedorAttributes {
    public fornecedor_id!: number;
    public nome!: string;
    public email!: string;
    public telefone!: string;
}

Fornecedor.init(
    {
        fornecedor_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        telefone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: "fornecedores",
        timestamps: false,
    }
);

export default Fornecedor;